from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .pin import Pin #[LR] Import pin for relationship mapping




class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
#[LR] one-to-many relationship allows access to all pins a user made.
#[LR] cascade="all, delete-orphan" it deletes a user's pins if the user gets deleted, so DB stays tidy
    pins = db.relationship("Pin", back_populates="user", cascade="all, delete-orphan")

    comments = db.relationship("Comment", back_populates="user", cascade="all, delete-orphan")  # If delete a User, all their Comment rows should be deleted too thats why I added cascade="all, delete-orphan"


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
