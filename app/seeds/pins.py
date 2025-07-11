from app.models import db, Pin

def seed_pins():
    pin1 = Pin(
        user_id=1,
        image_url='https://www.pexels.com/photo/white-pearl-ring-on-blue-surface-1395305/',
        title='Antique Pearl Ring',
        description='Diamonds and pearls together create a soft and enchanting aesthetic.',
        likes_count=44
    )

    pin2 = Pin(
        user_id=2,
        image_url='https://www.pexels.com/photo/white-boats-on-body-of-water-2265876/',
        title='Floating Along',
        description='Boat gathering on the beautiful coast of Peru.',
        likes_count=22
    )

    pin3 = Pin(
        user_id=3,
        image_url='https://www.pexels.com/photo/7-elephants-walking-beside-body-of-water-during-daytime-59989/',
        title='Elephant Family',
        description='This pack of elephants are hanging out around watering hole, enjoying the sun',
        likes_count= 33
    )




    db.session.add_all([pin1, pin2, pin3])
    db.session.commit()

def undo_pins():
    db.session.execute('DELETE FROM pins')
    db.session.commit()