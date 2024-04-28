from config import app, db
from models import User, Friendship, Post, Chat
from models import Comment, Message, Want, Pass, Pic
from faker import Faker
from random import choice
# import ipdb

if __name__ == "__main__":
    fake = Faker()
    # ipdb.set_trace()
    with app.app_context():
        # ipdb.set_trace()
        statuses = [
            "friend",
            "wife",
            "husband",
            "cousin",
            "brother",
            "sister",
            "mother",
            "father",
            "fiance",
        ]
        states = [
            "Alaska",
            "Alabama",
            "Arkansas",
            "American Samoa",
            "Arizona",
            "California",
            "Colorado",
            "Connecticut",
            "District ",
            "of Columbia",
            "Delaware",
            "Florida",
            "Georgia",
            "Guam",
            "Hawaii",
            "Iowa",
            "Idaho",
            "Illinois",
            "Indiana",
            "Kansas",
            "Kentucky",
            "Louisiana",
            "Massachusetts",
            "Maryland",
            "Maine",
            "Michigan",
            "Minnesota",
            "Missouri",
            "Mississippi",
            "Montana",
            "North Carolina",
            "North Dakota",
            "Nebraska",
            "New Hampshire",
            "New Jersey",
            "New Mexico",
            "Nevada",
            "New York",
            "Ohio",
            "Oklahoma",
            "Oregon",
            "Pennsylvania",
            "Puerto Rico",
            "Rhode Island",
            "South Carolina",
            "South Dakota",
            "Tennessee",
            "Texas",
            "Utah",
            "Virginia",
            "Virgin Islands",
            "Vermont",
            "Washington",
            "Wisconsin",
            "West Virginia",
            "Wyoming",
        ]
        image = "/images/post1.jpg"
        banner = "/images/banner1.jpg"
        mike_pic = "/images/mike.jpg"
        prof_pic_1 = "/images/profile1.jpg"
        prof_pic_2 = "/images/profile2.jpg"
        print("Starting seed...")
        print("Deleting all records...")
        db.drop_all()
        db.session.commit()
        db.create_all()
        db.session.commit()
        print("Creating records...")
        users = [
            User(
                username=fake.user_name(),
                password_hash=fake.domain_word(),
                email=fake.free_email(),
                bday=fake.date(),
                phone=fake.phone_number(),
                city=fake.city(),
                country=fake.country(),
                state=choice(states),
                profile_pic=mike_pic,
                banner_pic=banner,
                bio=fake.paragraph(nb_sentences=5),
                status=choice(['Single', 'Married', 'Engaged', 'Taken'])
            ) for i in range(50)
        ]
        one_user = User(
            username="abc",
            password_hash="abc",
            email="abc@gmail.com",
            bday="25jul94",
            phone="9086556982",
            city="newport news",
            country="united states",
            state="va",
            profile_pic=prof_pic_1,
            banner_pic=banner,
            bio=fake.paragraph(nb_sentences=5),
            status=choice(['Single', 'Married', 'Engaged', 'Taken'])
        )
        two_user = User(
            username="def",
            password_hash="def",
            email="def@gmail.com",
            bday="25jul94",
            phone="9086556982",
            city="newport news",
            country="united states",
            state="va",
            profile_pic=prof_pic_2,
            banner_pic=banner,
            bio=fake.paragraph(nb_sentences=5),
            status=choice(['Single', 'Married', 'Engaged', 'Taken'])
        )
        users.append(one_user)
        users.append(two_user)
        posts = [
            Post(
                str_content=fake.paragraph(nb_sentences=5),
                price=choice(range(200)),
                is_sold=False,
                type="Sale",
                user=choice(users),
            )
            for i in range(100)
        ]
        pics = [
            Pic(
                media=image,
                post_id=int(i)
            )
            for i in range(1, 101)
        ]
        db.session.add_all(users + posts + pics)
        db.session.commit()
        pulled_users = User.query.all()
        pulled_posts = Post.query.all()
        friendships = []
        for i in range(100):
            user1 = choice(pulled_users)
            user2 = choice([user for user in pulled_users if user != user1])
            f = Friendship(
                status=choice(statuses), user1_id=user1.id, user2_id=user2.id
            )
            friendships.append(f)
        comments = [
            Comment(
                content=fake.paragraph(nb_sentences=1),
                likes=choice(range(20)),
                user=choice(pulled_users),
                post=choice(pulled_posts),
            )
            for i in range(200)
        ]
        wants = [
            Want(user=choice(pulled_users), post=choice(pulled_posts))
            for i in range(1000)
        ]
        passes = [
            Pass(user=choice(pulled_users), post=choice(pulled_posts))
            for i in range(1000)
        ]
        chats = []
        for i in range(80):
            user1 = choice(pulled_users)
            user2 = choice([user for user in pulled_users if user != user1])
            c = Chat(
                theme="normal",
                font="normal",
                font_size=12,
                user1_id=user1.id,
                user2_id=user2.id,
            )
            chats.append(c)
        db.session.add_all(friendships + chats + comments + wants + passes)
        db.session.commit()
        pulled_chats = Chat.query.all()
        messages = []
        for i in range(1000):
            chat = choice(pulled_chats)
            user1 = User.query.filter_by(id=chat.user1_id).first()
            user2 = User.query.filter_by(id=chat.user2_id).first()
            user = choice([user1, user2])
            m = Message(
                content=fake.paragraph(nb_sentences=choice(range(5))),
                reactions=fake.emoji(),
                chat=chat,
                user=user
            )
            messages.append(m)
        first_user = User.query.filter_by(username=one_user.username).first()
        second_user = User.query.filter_by(username=two_user.username).first()
        ind_chat = Chat(
            theme="normal",
            font="normal",
            font_size=12,
            user1_id=first_user.id,
            user2_id=second_user.id,
        )
        db.session.add_all(messages + [ind_chat])
        db.session.commit()
        print("Complete.")
