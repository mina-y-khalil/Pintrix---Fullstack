from app.models import db, pin_boards, environment, SCHEMA
from sqlalchemy.sql import text

def seed_pin_boards():
    db.session.execute(pin_boards.insert().values([
        {'pin_id': 1, 'board_id': 1},
        {'pin_id': 2, 'board_id': 1},
        {'pin_id': 3, 'board_id': 2},
        {'pin_id': 1, 'board_id': 3},
    ]))
    db.session.commit()


def undo_pin_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pin_boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pin_boards"))
        
    db.session.commit()