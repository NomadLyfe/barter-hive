from flask_socketio import emit
from config import app, db, api, socketio
from models import User, Friendship, Post, Chat
from models import Comment, Message, Want, Pass, Pic
from flask import request, session, render_template, send_from_directory
from flask_restful import Resource
from sqlalchemy import or_, and_
from PIL import Image
from io import BytesIO
import base64


@app.route("/")
@app.route("/<int:id>")
def index(id=0):
    return render_template("index.html")


@app.route('/api/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)


@socketio.on("json")
def handle_chat(data):
    try:
        message_text = data.get('message')
        chat_id = data.get('chat_id')
        user_id = data.get('user_id')
        chat = db.session.get(Chat, chat_id)
        user = db.session.get(User, user_id)
        if chat and user:
            message = Message(
                content=message_text,
                chat=chat,
                user=user
            )
            db.session.add(message)
            db.session.commit()
            messages = [m.to_dict() for m in chat.messages]
            emit("chat_result", messages, broadcast=True)
        else:
            emit("chat_error", "Invalid chat or user", broadcast=False)
    except Exception:
        emit("chat_error", str(Exception), broadcast=False)

@socketio.on("start_typing")
def handle_start_typing(data):
    try:
        chat_id = data.get('chat_id')
        user_id = data.get('user_id')
        user = db.session.get(User, user_id)

        if user and chat_id:
            emit(
                "typing",
                {"chat_id": chat_id, "user": user.username},
                broadcast=True
            )
        else:
            emit("chat_error", "Invalid user or chat ID", broadcast=False)
    except Exception as e:
        emit("chat_error", str(e), broadcast=False)

@socketio.on("stop_typing")
def handle_stop_typing(data):
    try:
        chat_id = data.get('chat_id')
        user_id = data.get('user_id')
        user = db.session.get(User, user_id)

        if user and chat_id:
            emit(
                "stop_typing",
                {"chat_id": chat_id, "user": user.username},
                broadcast=True
            )
        else:
            emit("chat_error", "Invalid user or chat ID", broadcast=False)
    except Exception as e:
        emit("chat_error", str(e), broadcast=False)


class Login(Resource):
    def post(self):
        print(1)
        username = request.get_json().get("username")
        user = User.query.filter_by(username=username).first()
        password = request.get_json().get("password")
        if user and user.authenticate(password):
            session["user_id"] = user.id
            session.modified = True
            return user.to_dict(), 201
        return {"error": "Invalid username or password"}, 401

    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
            return {}, 204
        return {"error": "You are not logged in"}, 401


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = db.session.get(User, user_id)
            return user.to_dict(), 200
        return {}, 204


class Users(Resource):
    def patch(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Not logged in"}, 401
        user = db.session.get(User, user_id)
        user.username = request.get_json().get("username")
        user.email = request.get_json().get("email")
        user.phone = request.get_json().get("phone")
        user.city = request.get_json().get("city")
        user.state = request.get_json().get("state")
        user.country = request.get_json().get("country")
        user.bio = request.get_json().get("bio")
        user.status = request.get_json().get("status")
        if request.get_json().get("password"):
            user.password_hash = request.get_json().get("password")
        if request.get_json().get("profile"):
            profile_pic = request.get_json().get("profile")
            try:
                Image.open(BytesIO(base64.b64decode(profile_pic)))
            except Exception:
                return {'error': 'Invalid image file'}, 400
            with open(f'images/{user.id}profile.jpg', 'wb') as file:
                file.write(base64.b64decode(profile_pic))
            user.profile_pic = f'/images/{user.id}profile.jpg'
        if request.get_json().get("banner"):
            banner_pic = request.get_json().get("banner")
            try:
                Image.open(BytesIO(base64.b64decode(banner_pic)))
            except Exception:
                return {'error': 'Invalid image file'}, 400
            with open(f'images/{user.id}banner.jpg', 'wb') as file:
                file.write(base64.b64decode(banner_pic))
            user.banner_pic = f'/images/{user.id}banner.jpg'
        db.session.commit()
        return user.to_dict(), 201

    def post(self):
        print("hi")
        username = request.get_json().get("username")
        email = request.get_json().get("email")
        bday = request.get_json().get("bday")
        phone = request.get_json().get("phone")
        country = request.get_json().get("country")
        state = request.get_json().get("state")
        city = request.get_json().get("city")
        user = User(
            username=username,
            email=email,
            bday=bday,
            phone=phone,
            country=country,
            state=state,
            city=city,
        )
        user.password_hash = request.get_json().get("password")
        if user:
            db.session.add(user)
            db.session.commit()
            session["user_id"] = user.id
            return user.to_dict(), 201
        return {"error": "Invalid information submitted"}, 422


class Posts(Resource):
    def post(self):
        offset = request.get_json().get("offset")
        # allposts = Post.query.count()
        # posts = None
        # if offset <= allposts - 5:
        posts = [
            post.to_dict() for post in Post.query.offset(
                offset
            ).limit(5).all()
        ]
        if posts:
            return posts, 200
        return {}, 404


class SearchUsers(Resource):
    def get(self, term):
        users = [
            user.to_dict()
            for user in User.query.filter(
                User.username.contains(term)
            ).limit(8).all()
        ]
        if users:
            return users, 200
        return {}, 204


class SearchPosts(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        posts = [
            post.to_dict() for post in Post.query.filter_by(
                user_id=user.id
            ).order_by(Post.id.desc()).all()
        ]
        if posts:
            return posts, 200
        return {}, 204


class SearchChats(Resource):
    def post(self):
        username1 = request.get_json().get("user1")
        username2 = request.get_json().get("user2")
        user1 = User.query.filter_by(username=username1).first()
        user2 = User.query.filter_by(username=username2).first()
        chat = Chat.query.filter(or_(
                and_(Chat.user1_id == user1.id, Chat.user2_id == user2.id),
                and_(Chat.user1_id == user2.id, Chat.user2_id == user1.id)
        )).first()
        if chat:
            return chat.to_dict(), 200
        return {}, 204


class Wants(Resource):
    def post(self):
        user_id = request.get_json().get('user_id')
        post_id = request.get_json().get('post_id')
        want = Want(user_id=user_id, post_id=post_id)
        if want:
            db.session.add(want)
            db.session.commit()
            post = db.session.get(Post, post_id)
            return post.to_dict(), 200
        return {"error": "Invalid information submitted"}, 422


class Passes(Resource):
    def post(self):
        user_id = request.get_json().get('user_id')
        post_id = request.get_json().get('post_id')
        p = Pass(user_id=user_id, post_id=post_id)
        if p:
            db.session.add(p)
            db.session.commit()
            post = db.session.get(Post, post_id)
            return post.to_dict(), 200
        return {"error": "Invalid information submitted"}, 422


class Friends(Resource):
    def post(self):
        user1_id = request.get_json().get("user1_id")
        user2_id = request.get_json().get("user2_id")
        new_friendship = Friendship(
            status='friend',
            user1_id=user1_id,
            user2_id=user2_id
        )
        db.session.add(new_friendship)
        db.session.commit()
        u = db.session.get(User, user1_id)
        if new_friendship:
            return u.to_dict(), 200
        return {}, 204


class Chats(Resource):
    def post(self):
        user1_id = request.get_json().get("user1_id")
        user2_id = request.get_json().get("user2_id")
        new_chat = Chat(
            theme='normal',
            font='normal',
            font_size=12,
            user1_id=user1_id,
            user2_id=user2_id
        )
        if new_chat:
            db.session.add(new_chat)
            db.session.commit()
            u = db.session.get(User, user1_id)
            response = {
                'u': u.to_dict(),
                'new_chat': new_chat.to_dict()
            }
            return response, 200
        return {}, 204


class Comments(Resource):
    def post(self):
        new_comment = Comment(
            content=request.get_json().get("comment"),
            likes=0,
            user_id=request.get_json().get("user_id"),
            post_id=request.get_json().get("post_id")
        )
        if new_comment:
            db.session.add(new_comment)
            db.session.commit()
            # posts = None
            # if request.get_json().get("userpage"):
            #     userpage_id = request.get_json().get("userpage_id")
            #     posts = Post.query.filter_by(user_id=userpage_id).all()
            # else:
            #     post_num = request.get_json().get("posts")
            #     posts = Post.query.limit(post_num).all()
            # return [post.to_dict() for post in posts], 200
            post = db.session.get(Post, request.get_json().get("post_id"))
            return post.to_dict(), 200
        return {}, 404

    def patch(self):  # ****
        comment_id = request.get_json().get("id")  #
        comment = db.session.get(Comment, comment_id)
        if comment:
            if request.get_json().get("new_content"):
                comment.content = request.get_json().get("new_content")  #
            else:
                comment.likes += 1
            db.session.add(comment)
            db.session.commit()
            return comment.to_dict(), 200
        return {}, 404


class DeleteFriend(Resource):
    def delete(self, friend_id, user_id):
        f_id = int(friend_id[6:])
        friendship = Friendship.query.filter(or_(
            and_(Friendship.user1_id == user_id, Friendship.user2_id == f_id),
            and_(Friendship.user1_id == f_id, Friendship.user2_id == user_id)
        )).first()
        if friendship:
            db.session.delete(friendship)
            db.session.commit()
            user = db.session.get(User, user_id)
            return user.to_dict(), 200
        return {'error': 'No friend found'}, 404


class DeleteChat(Resource):
    def delete(self, friend_id, user_id):
        friend_id = int(friend_id[4:])
        chat = Chat.query.filter(or_(
            and_(Chat.user1_id == user_id, Chat.user2_id == friend_id),
            and_(Chat.user1_id == friend_id, Chat.user2_id == user_id)
        )).first()
        if chat:
            chat_id = chat.id
            db.session.delete(chat)
            db.session.commit()
            user = db.session.get(User, user_id)
            response = {
                'u': user.to_dict(),
                'chat_id': chat_id
            }
            return response, 200
        return {'error': 'No friend found'}, 404


class DeleteUser(Resource):
    def delete(self, user_id):
        user = db.session.get(User, user_id)
        if user:
            user.delete(user)
            db.session.commit()
            return {'success': f'user {user_id} has been deleted'}, 200
        return {'error': 'No friend found'}, 404


class DeleteComment(Resource):
    def delete(self, comment_id, post_id):
        comment = db.session.get(Comment, comment_id)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            post = db.session.get(Post, post_id)
            return post.to_dict(), 200
        return {'error': 'No comment found'}, 404


class CreatePost(Resource):
    def post(self):
        try:
            type = request.get_json().get('type')
            str_content = request.get_json().get('str_content')
            user = User.query.filter_by(id=session["user_id"]).first()
            pic_content = request.get_json().get('pic_content')
            price = request.get_json().get('price', 0)
            new_post = Post(
                str_content=str_content,
                type=type,
                is_sold=False,
                user=user,
                price=price
            )
            db.session.add(new_post)
            db.session.commit()
            if pic_content:
                for i, pic in enumerate(pic_content):
                    try:
                        Image.open(BytesIO(base64.b64decode(pic)))
                    except Exception:
                        return {'error': 'Invalid image file'}, 400
                    url = f'images/{new_post.id}{i}media.jpg'
                    with open(url, 'wb') as file:
                        file.write(base64.b64decode(pic))
                    new_pic = Pic(media=f'/{url}', post_id=new_post.id)
                    db.session.add(new_pic)
                    db.session.commit()
            posts = []
            if request.get_json().get('userpage'):
                userpage_id = request.get_json().get('userpage_id')
                posts = [
                    post.to_dict() for post in Post.query.filter_by(
                        user_id=userpage_id
                    ).order_by(Post.id.desc()).all()
                ]
            else:
                post_num = request.get_json().get('post_num')
                posts = [
                    post.to_dict() for post in Post.query.limit(post_num).all()
                ]
            return posts, 200
        except Exception as e:
            return {'error': str(e)}, 404


api.add_resource(Login, "/api/login", endpoint="login")
api.add_resource(CheckSession, "/api/check_session", endpoint="check_session")
api.add_resource(Users, "/api/users", endpoint="users")
api.add_resource(Posts, "/api/posts", endpoint="posts")
api.add_resource(SearchUsers, "/api/search_users/<string:term>")
api.add_resource(SearchPosts, "/api/search_posts/<string:username>")
api.add_resource(SearchChats, "/api/search_chats", endpoint="search_chats")
api.add_resource(Wants, "/api/wants", endpoint="wants")
api.add_resource(Passes, "/api/passes", endpoint="passes")
api.add_resource(Friends, "/api/friends", endpoint="friends")
api.add_resource(Chats, "/api/chats", endpoint="chats")
api.add_resource(Comments, "/api/comments", endpoint="comments")
api.add_resource(DeleteFriend, '/api/friend/<string:friend_id>/<int:user_id>')
api.add_resource(DeleteChat, '/api/chat/<string:friend_id>/<int:user_id>')
api.add_resource(DeleteUser, '/api/user/<int:user_id>')
api.add_resource(DeleteComment, '/api/comment/<int:comment_id>/<int:post_id>')
api.add_resource(CreatePost, '/api/createpost', endpoint='createpost')

if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)
    # app.run(port=5555, debug=True)
