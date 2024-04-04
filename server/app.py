from config import app, db, api
from models import User, Friendship, Post, Chat, Comment, Message
from flask import request, session, render_template
from flask_restful import Resource
import requests
import ipdb


@app.route("/")
@app.route("/<int:id>")
def index(id=0):
    return render_template("index.html")


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
                post.to_dict() for post in
                Post.query.offset(offset).limit(5).all()
            ]
        if posts:
            return posts, 200
        return {}, 204


class SearchUsers(Resource):
    def get(self, term):
        users = [
            user.to_dict() for user in
            User.query.filter(User.username.contains(term)).limit(8).all()
        ]
        if users:
            return users, 200
        return {}, 204


class SearchPosts(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        posts = [
            post.to_dict() for post in
            Post.query.filter_by(user_id=user.id).all()
        ]
        if posts:
            return posts, 200
        return {}, 204


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

if __name__ == "__main__":
    app.run(port=5555, debug=True)
