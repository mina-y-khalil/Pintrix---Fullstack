from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Board, Pin, pin_boards


board_routes = Blueprint('boards', __name__)

#VIEW ALL BOARDS FROM CURRENT USER -LA
@board_routes.route('/', methods=['GET'])
@login_required
def get_current_user_boards():
    """
    Get all boards for the current logged-in user
    """
    boards = Board.query.options(db.joinedload(Board.pins)).filter_by(user_id=current_user.id).all()
    return {'boards': [board.to_dict() for board in boards]}, 200

#CREATE BOARD -LA
@board_routes.route('/', methods=['POST'])
@login_required
def create_board():
    """
    Create a new board for the current user
    """
    data = request.get_json()
    name = data.get('name')

    if not name:
        return {'error': 'Board name is required'}, 400

    new_board = Board(
        user_id=current_user.id,
        name=name
    )

    db.session.add(new_board)
    db.session.commit()

    return new_board.to_dict(), 201

#ADD PIN TO BOARD -LA
@board_routes.route('/<int:board_id>/pins', methods=['POST'])
@login_required
def add_pin_to_board(board_id):
    """
    Add a pin to a board
    """
    data = request.get_json()
    pin_id = data.get('pin_id')

    if not pin_id:
        return {'error': 'pin_id is required'}, 400

    board = Board.query.get(board_id)
    pin = Pin.query.get(pin_id)

    if not board or not pin:
        return {'error': 'Board or Pin not found'}, 404

    if board.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    if pin in board.pins:
        return {'message': 'Pin already in board'}, 200
    
    board.pins.append(pin)
    db.session.commit()

    return pin.to_dict(), 200

#REMOVE PIN FROM A BOARD -LA
@board_routes.route('/<int:board_id>/pins/<int:pin_id>', methods=['DELETE'])
@login_required
def remove_pin_from_board(board_id, pin_id):
    """
    Remove a pin from a board
    """
    board = Board.query.get(board_id)
    pin = Pin.query.get(pin_id)

    if not board or not pin:
        return {'error': 'Board or Pin not found'}, 404
    
    if board.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    if pin in board.pins:
        board.pins.remove(pin)
        db.session.commit()
        return {'message': 'Pin removed from board'}, 200
    
    return {'error': 'Pin not found on this board'}, 404



#VIEW A BOARD -LA
@board_routes.route('/<int:board_id>', methods=['GET'])
@login_required
def get_board(board_id):
    """
    Query for a board by id and returns that board in a dictionary
    """
    board = Board.query.get(board_id)

    if not board:
        return {'error': 'Board not found'}, 404
    
    return board.to_dict()


#UPDATE BOARD -LA
@board_routes.route('/<int:board_id>', methods=['PATCH'])
@login_required
def update_board(board_id):
    """
    Update a board's name for the current user
    """
    board = Board.query.get(board_id)

    if not board:
        return {'error': 'Board not found'}, 404
    
    if board.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    new_name = data.get('name')

    if not new_name:
        return {'error': 'Board name is required'}, 400
    
    board.name = new_name
    db.session.commit()

    return board.to_dict(), 200


#DELETE BOARD
@board_routes.route('/<int:board_id>', methods=['DELETE'])
@login_required
def delete_board(board_id):
    """
    Delete a board owned by the current user
    """
    board = Board.query.get(board_id)

    if not board:
        return {'error': 'Board not found'}, 404
    
    if board.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    db.session.delete(board)
    db.session.commit()

    return {'message': 'Board deleted successfully'}, 200