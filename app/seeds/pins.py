from app.models import db, Pin, environment, SCHEMA
from sqlalchemy.sql import text

def seed_pins():
    pins = [
        # Jewelry board
        Pin(user_id=1, image_url='https://images.pexels.com/photos/1395305/pexels-photo-1395305.jpeg',
            title='Antique Pearl Ring',
            description='Diamonds and pearls together create a soft and enchanting aesthetic.',
            likes_count=3),
        
        Pin(user_id=2, image_url='https://images.pexels.com/photos/6625939/pexels-photo-6625939.jpeg',
            title='Say yess!',
            description='Beautiful ring set for your special day',
            likes_count=1),
        
        Pin(user_id=3, image_url='https://images.pexels.com/photos/6625937/pexels-photo-6625937.jpeg',
            title='Peacock love',
            description='Make a statement with this beautiful necklace! Inspired by the beautiful peacock.',
            likes_count=1),
        
        Pin(user_id=1, image_url='https://images.pexels.com/photos/3634366/pexels-photo-3634366.jpeg',
            title='Timeless bracelet',
            description='This bracelet is stunning and goes with everything, it can be worn every day!',
            likes_count=1),

        # Vacation board
        Pin(user_id=2, image_url='https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg',
            title='Floating Along',
            description='Boat gathering on the beautiful coast of Peru.',
            likes_count=1),
        
        Pin(user_id=1, image_url='https://images.pexels.com/photos/33111360/pexels-photo-33111360.jpeg',
            title='Sail away!',
            description='These boat rentals are great for using while on vacation',
            likes_count=1),
        
        Pin(user_id=2, image_url='https://images.pexels.com/photos/33068153/pexels-photo-33068153.png',
            title='Cruisin easy',
            description='Cruise ships are always a good time. One flat rate for an all-inclusive vacation',
            likes_count=1),
        
        Pin(user_id=3, image_url='https://images.pexels.com/photos/33052728/pexels-photo-33052728.jpeg',
            title='Family fun',
            description='So many fun activities for the kids! A great place to make wonderful memories',
            likes_count=1),

        # Animal board
      
        Pin(user_id=2, image_url='https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg',
            title='Zebra Secrets',
            description='Two zebras sharing secrets in the African savanna, their stripes creating a beautiful pattern against the golden grass.',
            likes_count=1),
        
        Pin(user_id=3, image_url='https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg',
            title='Kitten love!',
            description='These adorable four-week-old kittens enjoying the grass for the first time.',
            likes_count=1),
        
        Pin(user_id=1, image_url='https://images.pexels.com/photos/37833/rainbow-lorikeet-parrots-australia-rainbow-37833.jpeg',
            title='Double the trouble',
            description='Father and son looking like twins',
            likes_count=1),
        
        Pin(user_id=2, image_url='https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg',
            title='Feeling sheepish',
            description='He’s a little confused after being asked to say cheese',
            likes_count=1)
    ]

    db.session.add_all(pins)
    db.session.commit()

def undo_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pins"))
    db.session.commit()