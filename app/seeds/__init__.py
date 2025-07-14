from flask.cli import AppGroup
from .users import seed_users, undo_users
from .boards import seed_boards, undo_boards
from .favorites import seed_favorites, undo_favorites
from .comments import seed_comments, undo_comments

from app.models.db import db, environment, SCHEMA


seed_commands = AppGroup('seed')


@seed_commands.command('all')
def seed():
    if environment == 'production':
        
        undo_users()
        undo_boards()
       

    seed_users()
    seed_boards()
    seed_comments()
   

@seed_commands.command('undo')
def undo():
    undo_users()
    undo_boards()
    undo_comments()
   
