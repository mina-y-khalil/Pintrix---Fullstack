from app.models import db, pin_boards, environment, SCHEMA
from sqlalchemy.sql import text

def seed_pin_boards():
    db.session.execute(pin_boards.insert().values([
        {'pin_id': 1, 'board_id': 1},
        {'pin_id': 2, 'board_id': 1},
        {'pin_id': 3, 'board_id': 1},
        {'pin_id': 4, 'board_id': 1},
        {'pin_id': 5, 'board_id': 2},
        {'pin_id': 6, 'board_id': 2},
        {'pin_id': 7, 'board_id': 2},
        {'pin_id': 8, 'board_id': 2},
        {'pin_id': 9, 'board_id': 3},
        {'pin_id': 10, 'board_id': 3},
        {'pin_id': 11, 'board_id': 3},
        {'pin_id': 12, 'board_id': 3},
        {'pin_id': 1, 'board_id': 4},
        {'pin_id': 2, 'board_id': 5},
        {'pin_id': 3, 'board_id': 6},
        {'pin_id': 1, 'board_id': 7},
    ]))
    db.session.commit()


def undo_pin_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pin_boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pin_boards"))
        
    db.session.commit()