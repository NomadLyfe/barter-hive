from config import app, db
from models import User, Friendship, Post, Chat, Comment, Message
from faker import Faker
from random import randint, choice
import ipdb

if __name__ == "__main__":
    fake = Faker()
    #ipdb.set_trace()
    with app.app_context():
        ipdb.set_trace()
        # print('Starting seed...')
        # print('Deleting all records...')
        # User.query.delete()
        # Friendship.query.delete()
        # Post.query.delete()
        # Chat.query.delete()
        # Comment.query.delete()
        # Message.query.delete()
        # db.session.commit()
        # print('Creating records...')
        # users = [User(username=fake.user_name(), email=fake.free_email(), bday=fake.date(), phone=fake.phone_number(), city=fake.city(), country=fake.country(), state=fake.address.state()) for i in range(20)]
        # friendships = [Friendship() for i in range(100)]
        # posts = [Post() for i in range(50)]
        # chats = [Chat() for i in range(80)]
        # comments = [Comment() for i in range(200)]
        # messages = [Message() for i in range(2000)]
        # db.session.add_all(users + friendships + posts + chats + comments + messages)
        # db.session.commit()
        # print('Complete.')
        pass