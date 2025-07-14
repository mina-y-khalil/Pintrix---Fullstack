from flask.cli import AppGroup
from .users import seed_users, undo_users
<<<<<<< HEAD
from .boards import seed_boards, undo_boards
from .favorites import seed_favorites, undo_favorites
=======
from .comments import seed_comments, undo_comments

>>>>>>> mk

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    seed_favorites()
    # Add other seed functions here
<<<<<<< HEAD
    seed_boards()
=======
    seed_comments()  
>>>>>>> mk


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_favorites()
    # Add other undo functions here
<<<<<<< HEAD
    undo_boards()
=======
    undo_comments()
>>>>>>> mk
