from .db import db, environment, SCHEMA
from datetime import datetime

class Pin(db.Model):
    __tablename__ = 'pins'
    
    if environment == 'production':
        __table_args__ = {'schema' : SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image_url = db.Column(db.String, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    likes_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='pins')
    #comments = db.relationship('Comment', back_populates='pin', cascade='all, delete-orphan')
    #favorites = db.relationship('Favorite', back_populates='pin', cascade='all, delete-orphan')
    #boards = db.relationship('BoardPin', back_populates='pin', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'title': self.title,
            'description': self.description,
            'likes_count': self.likes_count,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

