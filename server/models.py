from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts.user', '-comments.user1', '-comments.user2', '-chats.user1', '-chats.user2', 'friendships1.user1', 'friendships2.user1', 'friendships1.user2', 'friendships2.user2',)

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

    friendships1 = db.relationship('Friendship', back_populates='user1', cascade='all, delete-orphan')
    friendships2 = db.relationship('Friendship', back_populates='user2', cascade='all, delete-orphan')
    friends1 = association_proxy('friendships', 'user', creator=lambda user_obj: Comment(user1=user_obj))
    friends2 = association_proxy('friendships', 'user', creator=lambda user_obj: Comment(user2=user_obj))
    
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')

    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    commented_posts = association_proxy('comments', 'post', creator=lambda post_obj: Comment(post=post_obj))

    chats = db.relationship('Chat', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Friendship(db.Model, SerializerMixin):
    __tablename__ = 'friendships'

    serialize_rules = ('user1.', 'user2.',)

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

    serialize_rules = ('-comments.post', '-user.posts',)

    id = db.Column(db.Integer, primary_key=True)
    endorse = db.Column(db.Integer, nullable=False)
    renounce = db.Column(db.Integer, nullable=False)
    str_content = db.Column(db.String)
    pic_content = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    is_sold = db.Column(db.Boolean, nullable=False)
    type = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='posts', cascade='all, delete-orphan')

    comments = db.relationship('Comment', back_populates='post', cascade='all, delete-orphan')

    commenting_users = association_proxy('comments', 'user', creator=lambda user_obj: Comment(user=user_obj))
    
    def __repr__(self):
        return f'Post ID {self.id}'
 
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ('-post.comments', '-user.comments',)

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

    serialize_rules = ('-user1.chats', '-user2.chats', '-messages.chat')

    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String)
    font = db.Column(db.String)
    font_size = db.Column(db.Integer)

    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user1 = db.relationship('User', back_populates='chats', cascade='all, delete-orphan')
    user2 = db.relationship('User', back_populates='chats', cascade='all, delete-orphan')

    messages = db.relationship('Message', back_populates='chat', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Chat ID {self.id}'

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    serialize_rules = ('-chat.messages',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    reactions = db.Column(db.String)

    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'))

    chat = db.relationship('Chat', back_populates='messages', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Message ID {self.id}'
