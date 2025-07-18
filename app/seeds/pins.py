from app.models import db, Pin, environment, SCHEMA
from sqlalchemy.sql import text

def seed_pins():
    pin1 = Pin(
        user_id=1,
        image_url='https://images.pexels.com/photos/1395305/pexels-photo-1395305.jpeg',
        title='Antique Pearl Ring',
        description='Diamonds and pearls together create a soft and enchanting aesthetic.',
        likes_count=3  # matches number of favorites for pin 1
    )
    pin2 = Pin(
        user_id=2,
        image_url='https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg',
        title='Floating Along',
        description='Boat gathering on the beautiful coast of Peru.',
        likes_count=1  # matches number of favorites for pin 2
    )
    pin3 = Pin(
        user_id=3,
        image_url='https://images.pexels.com/photos/59989/pexels-photo-59989.jpeg',
        title='Elephant Family',
        description='This pack of elephants are hanging out around watering hole, enjoying the sun',
        likes_count=1  # matches number of favorites for pin 3
    )

    # Add pins to the session and commit
    db.session.add_all([pin1, pin2, pin3])
    db.session.commit()



def undo_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pins"))
    db.session.commit()

