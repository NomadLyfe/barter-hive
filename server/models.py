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

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'
    