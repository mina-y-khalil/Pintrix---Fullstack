from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Pin, Favorite, db
from sqlalchemy.orm import joinedload

pin_routes = Blueprint('pins', __name__)

# Get all pins and return as a list of dictionaries
@pin_routes.route('/', methods=['GET'])
def get_all_pins():
    pins = Pin.query.all()
    return [pin.to_dict() for pin in pins]

# Get a single pin by its ID
@pin_routes.route('/<int:id>', methods=['GET'])
def get_pin_by_id(id):
    pin = Pin.query.get(id)
    if pin:
        return pin.to_dict()
    return {'errors': 'Pin not found'}, 404

# Only logged-in users can create a new pin
@pin_routes.route('/', methods=['POST'])
@login_required
def create_pin():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return {'errors': 'No data provided'}, 400
        
        # Handle both camelCase and snake_case field names
        title = data.get('title')
        image_url = data.get('image_url') or data.get('imageUrl')  # Handle both formats
        description = data.get('description')
        
        if not title:
            return {'errors': 'title is required'}, 400
        if not image_url:
            return {'errors': 'image_url is required'}, 400
        
        new_pin = Pin(
            user_id=current_user.id,
            title=title,
            image_url=image_url,
            description=description
        )
        
        db.session.add(new_pin)
        db.session.commit()
        
        return new_pin.to_dict(), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating pin: {str(e)}")  # For debugging
        return {'errors': 'Failed to create pin'}, 500

# Only the owner can update their pin
@pin_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_pin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {'errors': 'Pin not found'}, 404
    if pin.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 403

    # Update pin fields if new info is provided
    data = request.get_json()
    pin.title = data.get('title', pin.title)
    pin.image_url = data.get('image_url', pin.image_url)
    pin.description = data.get('description', pin.description)
    # likes_count is not updated by user
    db.session.commit()
    return pin.to_dict()

# Only the owner can delete their pin
@pin_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_pin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {'errors': 'Pin not found'}, 404
    if pin.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 403

    db.session.delete(pin)
    db.session.commit()
    return {'message': 'Pin deleted successfully'}

# Favorite a pin (user can only favorite once)
@pin_routes.route('/<int:id>/favorite', methods=['POST'])
@login_required
def favorite_pin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {'errors': 'Pin not found'}, 404

    # Prevent duplicate favorites
    existing = Favorite.query.filter_by(user_id=current_user.id, pin_id=id).first()
    if existing:
        return {'message': 'Already favorited'}, 200

    favorite = Favorite(user_id=current_user.id, pin_id=id)
    db.session.add(favorite)
    pin.likes_count += 1  # Increment likes count
    db.session.commit()
    return {'message': 'Pin favorited'}

# Unfavorite a pin
@pin_routes.route('/<int:id>/favorite', methods=['DELETE'])
@login_required
def unfavorite_pin(id):
    favorite = Favorite.query.filter_by(user_id=current_user.id, pin_id=id).first()
    if not favorite:
        return {'errors': 'Not favorited'}, 404

    db.session.delete(favorite)
    pin = Pin.query.get(id)
    if pin and pin.likes_count > 0:
        pin.likes_count -= 1  # Decrement likes count
    db.session.commit()
    return {'message': 'Pin unfavorited'}