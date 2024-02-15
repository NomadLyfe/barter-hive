from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    profile_pic = db.Column(db.String)
    banner_pic = db.Column(db.String)
    bday = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    reputation = db.Column(db.Integer)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)

    friendships = db.relationship('Friendship', back_populates='user', cascade='all, delete-orphan')
    friends = association_proxy('friendships', 'user')
    
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')

    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    commented_posts = association_proxy('comments', 'post', creator=lambda post_obj: Comment(post=post_obj))

    chats = db.relationship('Chat', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'

class Friendship(db.Model, SerializerMixin):
    __tablename__ = 'friendships'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)

    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user1 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')
    user2 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Friendship between {self.user1.username} and {self.user2.username}, ID {self.id}'
    
class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    endorse = db.Column(db.Integer, nullable=False)
    renounce = db.Column(db.Integer, nullable=False)
    str_content = db.Column(db.String)
    pic_content = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    is_sold = db.Column(db.Boolean, nullable=False)
    type = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    comments = db.relationship('Comment', back_populates='post', cascade='all, delete-orphan')

    commenting_users = association_proxy('comments', 'user', creator=lambda user_obj: Comment(user=user_obj))
    
    def __repr__(self):
        return f'Post ID {self.id}'
 
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    likes = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
    user = db.relationship('User', back_populates='comments', cascade='all, delete-orphan')
    post = db.relationship('Post', back_populates='comments', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Comment ID {self.id}'

class Chat(db.Model, SerializerMixin):
    __tablename__ = 'chats'

    id = db.Column()
    theme = db.Column()
    font = db.Column()
    font_size = db.Column()

    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user1 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')
    user2 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Chat ID {self.id}'
