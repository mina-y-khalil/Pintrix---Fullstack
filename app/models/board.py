from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .pin_board import pin_boards

class Board(db.Model):
    __tablename__ = 'boards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, 
        db.ForeignKey(add_prefix_for_prod("users.id")),
        nullable=False)
    name = db.Column(db.String(255), nullable=False, unique=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    #Relationships
    user = db.relationship('User', back_populates='boards')
    pins = db.relationship('Pin', secondary=pin_boards, back_populates='boards')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
