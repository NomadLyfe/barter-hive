from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re

class Friendship(db.Model, SerializerMixin):
    __tablename__ = 'friendships'

    serialize_rules = ()

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)

    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # user1 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')
    # user2 = db.relationship('User', back_populates='friendships', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Friendship between two friends, ID {self.id}'

class Chat(db.Model, SerializerMixin):
    __tablename__ = 'chats'

    serialize_rules = ('-messages.chat',)

    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String)
    font = db.Column(db.String)
    font_size = db.Column(db.Integer)

    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    #user1 = db.relationship('User', back_populates='chats', cascade='all, delete-orphan')
    #user2 = db.relationship('User', back_populates='chats', cascade='all, delete-orphan')

    messages = db.relationship('Message', back_populates='chat', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Chat ID {self.id}'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-posts.user',
        '-posts.comments.user',
        '-comments.user',
        '-commented_posts.user',
        '-friendships',
        '-chats',
    )

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
    country = db.Column(db.String, nullable=False)
    state = db.Column(db.String)

    friendships = db.relationship('User', secondary='friendships', primaryjoin="or_(User.id==Friendship.user1_id, User.id==Friendship.user2_id)", secondaryjoin="or_(User.id==Friendship.user1_id, User.id==Friendship.user2_id)")
    
    # friendships = db.relationship('User', secondary='friendships', primaryjoin=(Friendship.user1_id == id), secondaryjoin=(Friendship.user2_id == id))

    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')

    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    commented_posts = association_proxy('comments', 'post', creator=lambda post_obj: Comment(post=post_obj))

    chats = db.relationship('User', secondary='chats', primaryjoin="or_(User.id==Chat.user1_id, User.id==Chat.user2_id)", secondaryjoin="or_(User.id==Chat.user1_id, User.id==Chat.user2_id)")

    # chats = db.relationship('User', secondary='chats', primaryjoin=(Chat.user1_id == id), secondaryjoin=(Chat.user2_id == id))

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'
    
    @validates('username', 'email')
    def validate(self, key, value):
        if key == 'username' and len(value) > 25:
            raise ValueError('Username is too long.')
        if key == 'email':
            if len(value) > 50:
                raise ValueError('Email is too long.')
            pattern = r'^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
            regex = re.compile(pattern)
            match = regex.search(value)
            if match == None:
                raise ValueError('Not a proper email')
        return value

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ('-comments.post', '-user.posts', '-user.comments.post')

    id = db.Column(db.Integer, primary_key=True)
    endorse = db.Column(db.Integer, nullable=False)
    renounce = db.Column(db.Integer, nullable=False)
    str_content = db.Column(db.String)
    pic_content = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    is_sold = db.Column(db.Boolean, nullable=False)
    type = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='posts')

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
    
    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')

    def __repr__(self):
        return f'Comment ID {self.id}'

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    serialize_rules = ('-chat.messages',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    reactions = db.Column(db.String)

    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'))

    chat = db.relationship('Chat', back_populates='messages')

    def __repr__(self):
        return f'Message ID {self.id}'
