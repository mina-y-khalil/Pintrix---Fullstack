from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_boards():
    cute_dogs = Board(
        user_id=1, name='cute_dogs')
    cute_cats = Board(
        user_id=2, name='cute_cats')
    patio_furniture = Board(
        user_id=3, name='patio_furniture')
    home_office = Board(
        user_id=1, name='home_office')
    camping_gear = Board(
        user_id=2, name='camping_gear')
    minimalist_design = Board(
        user_id=3, name='minimalist_design')
    tech_gadgets = Board(
        user_id=1, name='tech_gadgets')
    wedding_ideas = Board(
        user_id=2, name='wedding_ideas')
    book_recommendations = Board(
        user_id=3, name='book_recommendations')

    db.session.add_all([
        cute_dogs,
        cute_cats,
        patio_furniture,
        home_office,
        camping_gear,
        minimalist_design,
        tech_gadgets,
        wedding_ideas,
        book_recommendations
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
        
    db.session.commit()
