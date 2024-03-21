from config import app, db
from models import User, Friendship, Post, Chat, Comment, Message, Want, Pass
from faker import Faker
from random import randint, choice
import ipdb

if __name__ == "__main__":
    fake = Faker()
    #ipdb.set_trace()
    with app.app_context():
        # ipdb.set_trace()
        statuses = ['friend', 'wife', 'husband', 'cousin', 'brother', 'sister', 'mother', 'father', 'fiance']
        states = ["Alaska", "Alabama", "Arkansas", "American Samoa", "Arizona", "California", "Colorado", "Connecticut", "District ", "of Columbia", "Delaware", "Florida", "Georgia", "Guam", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "Virgin Islands", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"]
        image = 'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds'
        banner = 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg'
        print('Starting seed...')
        print('Deleting all records...')
        User.query.delete()
        Friendship.query.delete()
        Post.query.delete()
        Chat.query.delete()
        Comment.query.delete()
        Message.query.delete()
        db.session.commit()
        print('Creating records...')
        users = [User(username=fake.user_name(), password_hash = fake.domain_word(), email=fake.free_email(), bday=fake.date(), phone=fake.phone_number(), city=fake.city(), country=fake.country(), state=choice(states), profile_pic='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeik6d5EHLTi89m_CKLXyShylk4L92YflpJQ&usqp=CAU') for i in range(50)]
        one_user = User(username='abc', password_hash = 'abc', email='abc@gmail.com', bday='25jul94', phone='9086556982', city='newport news', country='united states', state='va', profile_pic='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeik6d5EHLTi89m_CKLXyShylk4L92YflpJQ&usqp=CAU', banner_pic='https://img.freepik.com/free-vector/stylish-glowing-digital-red-lines-banner_1017-23964.jpg')
        users.append(one_user)
        posts = [Post(str_content=fake.paragraph(nb_sentences=5), pic_content=image, price=choice(range(200)), is_sold=False, type='sale', user=choice(users)) for i in range(100)]
        db.session.add_all(users + posts)
        db.session.commit()
        pulled_users = User.query.all()
        pulled_posts = Post.query.all()
        friendships = []
        for i in range(100):
            user1 = choice(pulled_users)
            user2 = choice([user for user in pulled_users if user != user1])
            f = Friendship(status=choice(statuses), user1_id=user1.id, user2_id=user2.id)
            friendships.append(f)
        comments = [Comment(content=fake.paragraph(nb_sentences=1), likes=choice(range(20)), user=choice(pulled_users), post=choice(pulled_posts)) for i in range(200)]
        wants = [Want(user=choice(pulled_users), post=choice(pulled_posts)) for i in range(1000)]
        passes = [Pass(user=choice(pulled_users), post=choice(pulled_posts)) for i in range(1000)]
        chats = []
        for i in range(80):
            user1 = choice(pulled_users)
            user2 = choice([user for user in pulled_users if user != user1])
            c = Chat(theme='normal', font='normal', font_size=12, user1_id=user1.id, user2_id=user2.id)
            chats.append(c)
        messages = [Message(content=fake.paragraph(nb_sentences=choice(range(5))), reactions=fake.emoji()) for i in range(1000)]
        db.session.add_all(friendships + chats + messages + comments + wants + passes)
        db.session.commit()
        print('Complete.')