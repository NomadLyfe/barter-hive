from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv
from flask_socketio import SocketIO
import os

load_dotenv()

origins = None
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        "http://xxxxx.ngrok.io",
        'http://127.0.0.1:8000',
        'https://barter-hive.onrender.com'
    ]
else:
    origins = [
        "*",
        "http://xxxxx.ngrok.io",
        "http://127.0.0.1:5173",
        'http://127.0.0.1:8000',
        'https://barter-hive.onrender.com'
    ]

naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=naming_convention)

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/dist',
    template_folder='../client/dist'
)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['UPLOAD_FOLDER'] = 'images'

db = SQLAlchemy(app=app, metadata=metadata)

migrate = Migrate(app=app, db=db)

socketio = SocketIO(app, cors_allowed_origins=origins)

bcrypt = Bcrypt(app=app)

api = Api(app=app)

CORS(app)
