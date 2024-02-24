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
        if user and user.authenticate(password):
            session['user_id'] = user.id
            session.modified = True
            print('You logged in!')
            return user.to_dict(), 201
        return {'error': 'Invalid username or password'}, 401
    
class Users(Resource):
    def post(self):
        try:
            username = request.get_json().get('username')
            email = request.get_json().get('email')
            bday = request.get_json().get('bday')
            phone = request.get_json().get('phone')
            country = request.get_json().get('country')
            state = request.get_json().get('state')
            city = request.get_json().get('city')
            user = User(username=username, email=email, bday=bday, phone=phone, country=country, state=state, city=city)
            user.password_hash = request.get_json().get('password')
            if user:
                db.session.add(user)
                db.session.commit()
                session['user_id'] = user.id
                return user.to_dict(), 201
            return {'error': 'Invalid information submitted'}, 422
        except:
            return {'error': 'Invalid user information'}, 422

api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Users, '/api/users', endpoint='users')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
