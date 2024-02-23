from config import app, db, api
from models import User, Friendship, Post, Chat, Comment, Message
from flask import request, session, render_template
from flask_restful import Resource
import requests

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        user = User.query.filter_by(username = username).first()
        password = request.get_json()['password']
        print(user)
        if user and user.authenticate(password):
            session['user_id'] = user.id
            session.modified = True
            return user.to_dict(), 201
        return {'error': 'Invalid username or password'}, 401

api.add_resource(Login, '/api/login', endpoint='login')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
