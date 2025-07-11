from flask import Blueprint, jsonify
from app.models import Pin

pin_routes = Blueprint('pins', __name__)

@pin_routes.route('/', methods=['GET'])
def get_all_pins():
    pins = Pin.query.all()
    return jsonify([pin.to_dict() for pin in pins])

@pin_routes.route('/<int:id>', methods=['GET'])
def get_pin_by_id(id):
    pin = Pin.query.get(id)

    if pin:
        return pin.to_dict()
    return {'errors': 'Pin not found'}, 404