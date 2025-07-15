from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Pin, db

pin_routes = Blueprint('pins', __name__)

#get all pins &return list of pins
@pin_routes.route('/', methods=['GET'])
def get_all_pins():
    pins = Pin.query.all()
    return jsonify([pin.to_dict() for pin in pins])

#get a single pin by ID
@pin_routes.route('/<int:id>', methods=['GET'])
def get_pin_by_id(id):
    pin = Pin.query.get(id)
    if pin:
        return pin.to_dict()
    return {'errors': 'Pin not found'}, 404

#only logged in users can create a new pin
@pin_routes.route('/', methods=['POST'])
@login_required
def create_pin():
    data = request.get_json()
    new_pin = Pin(
        user_id=current_user.id,
        title=data.get('title'),
        image_url=data.get('image_url'),
        description=data.get('description'),
        likes_count=data.get('likes_count', 0)
    )
    db.session.add(new_pin)
    db.session.commit()
    return new_pin.to_dict(), 201

#only owner can update pin
@pin_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_pin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {'errors': 'Pin not found'}, 404
    if pin.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 403

#update pin if new info is added
    data = request.get_json()
    pin.title = data.get('title', pin.title)
    pin.image_url = data.get('image_url', pin.image_url)
    pin.description = data.get('description', pin.description)
    pin.likes_count = data.get('likes_count', pin.likes_count)
    db.session.commit()
    return pin.to_dict()

#only owner can delete pins
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
    #deleted pin confermation 
