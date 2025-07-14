from .db import db, environment, SCHEMA, add_prefix_for_prod

pin_boards = db.Table(
    'pin_boards',
    db.Model.metadata,
    db.Column('pin_id', db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')), primary_key=True),
    db.Column('board_id', db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id')), primary_key=True)
)

if environment == "production":
    pin_boards.schema = SCHEMA