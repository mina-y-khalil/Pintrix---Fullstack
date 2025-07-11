from app.models import db, Comment
from datetime import datetime

def seed_comments():
    comment1 = Comment(user_id=1, pin_id=1, text="Nice post!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    comment2 = Comment(user_id=2, pin_id=1, text="Love this idea!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    db.session.add_all([comment1, comment2])
    db.session.commit()

def undo_comments():
    db.session.execute("DELETE FROM comments")
    db.session.commit()
