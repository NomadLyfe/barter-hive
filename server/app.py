from flask_socketio import emit
from config import app, db, api, socketio
from models import User, Friendship, Post, Chat, Comment, Message, Want, Pass
from flask import request, session, render_template, send_from_directory
from flask_restful import Resource
import base64
# import requests
# import ipdb


@app.route("/")
@app.route("/<int:id>")
def index(id=0):
    return render_template("index.html")


@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)


@socketio.on("json")
def handle_chat(data):
    message_text = data.get('message')
    chat = Chat.query.filter_by(id=data.get('chat_id')).first()
    user = User.query.filter_by(id=data.get('user_id')).first()
    message = Message(
        content=message_text,
        reactions=None,
        chat=chat,
        user=user
    )
    db.session.add(message)
    db.session.commit()
    messages = [
        m.to_dict() for m in Message.query.filter_by(
            chat_id=data.get('chat_id')
        )
    ]
    emit("chat_result", messages, broadcast=True)


class Login(Resource):
    def post(self):
        username = request.get_json()["username"]
        user = User.query.filter_by(username=username).first()
        password = request.get_json()["password"]
        if user and user.authenticate(password):
            session["user_id"] = user.id
            session.modified = True
            print("You logged in!")
            # ipdb.set_trace()
            return user.to_dict(), 201
        return {"error": "Invalid username or password"}, 401

    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
            return {}, 204
        return {"error": "You are not logged in"}, 401


class CheckSession(Resource):
    def get(self):
        if session.get("user_id"):
            user = User.query.filter_by(id=session["user_id"]).first()
            return user.to_dict(), 200
        return {}, 204


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        if users:
            return users, 200
        return {}, 204

    def patch(self):
        try:
            user = User.query.filter_by(id=session["user_id"]).first()
            user.username = request.get_json().get("username")
            if request.get_json().get("password"):
                user.password_hash = request.get_json().get("password")
            user.email = request.get_json().get("email")
            user.phone = request.get_json().get("phone")
            user.city = request.get_json().get("city")
            user.state = request.get_json().get("state")
            user.country = request.get_json().get("country")
            profile_pic = request.get_json().get("profile")
            if request.get_json().get("profile"):
                profile_pic = request.get_json().get("profile")
                with open(f'images/{user.id}profile.jpg', 'wb') as file:
                    file.write(base64.b64decode(profile_pic))
                user.profile_pic = f'/images/{user.id}profile.jpg'
            db.session.add(user)
            db.session.commit()
            session["user_id"] = user.id
            return user.to_dict(), 201
        except Exception:
            return {"error": "Invalid user information"}, 422

    def post(self):
        try:
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
        except Exception:
            return {"error": "Invalid user information"}, 422


class Posts(Resource):
    def get(self):
        pass
        # posts = [post.to_dict() for post in Post.query.limit(5).all()]
        # ipdb.set_trace()
        # if posts:
        #     return posts, 200
        # return {}, 204

    def post(self):
        offset = request.get_json().get("offset")
        allposts = Post.query.count()
        posts = None
        if offset <= allposts - 5:
            posts = [
                post.to_dict() for post in Post.query.offset(
                    offset
                ).limit(5).all()
            ]
        if posts:
            return posts, 200
        return {}, 204


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
            ).all()
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
        chat1 = Chat.query.filter(
            Chat.user1_id == user1.id, Chat.user2_id == user2.id
        ).first()
        chat2 = Chat.query.filter(
            Chat.user1_id == user2.id, Chat.user2_id == user1.id
        ).first()
        if chat1:
            return chat1.to_dict(), 200
        elif chat2:
            return chat2.to_dict(), 200
        return {}, 204


class Wants(Resource):
    def post(self):
        user = User.query.filter_by(
            id=request.get_json().get('user_id')
        ).first()
        post = Post.query.filter_by(
            id=request.get_json().get('post_id')
        ).first()
        want = Want(user=user, post=post)
        if want:
            db.session.add(want)
            db.session.commit()
            return want.to_dict(), 200
        return {"error": "Invalid information submitted"}, 422


class Passes(Resource):
    def post(self):
        user = User.query.filter_by(
            id=request.get_json().get('user_id')
        ).first()
        post = Post.query.filter_by(
            id=request.get_json().get('post_id')
        ).first()
        p = Pass(user=user, post=post)
        if p:
            db.session.add(p)
            db.session.commit()
            return p.to_dict(), 200
        return {"error": "Invalid information submitted"}, 422


api.add_resource(Login, "/api/login", endpoint="login")
api.add_resource(CheckSession, "/api/check_session", endpoint="check_session")
api.add_resource(Users, "/api/users", endpoint="users")
api.add_resource(Posts, "/api/posts", endpoint="posts")
api.add_resource(
    SearchUsers, "/api/search_users/<string:term>", endpoint="search_users"
)
api.add_resource(
    SearchPosts, "/api/search_posts/<string:username>", endpoint="search_posts"
)
api.add_resource(SearchChats, "/api/search_chats", endpoint="search_chats")
api.add_resource(Wants, "/api/wants", endpoint="wants")
api.add_resource(Passes, "/api/passes", endpoint="passes")

if __name__ == "__main__":
    socketio.run(app, port=5555, debug=True)
    # app.run(port=5555, debug=True)
