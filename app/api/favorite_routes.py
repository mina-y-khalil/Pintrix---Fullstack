from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Favorite, Pin, db

favorite_routes = Blueprint('favorites', __name__)

@favorite_routes.route('/')
@login_required
def view_favorites():
    pins = db.session.query(Pin).filter(Favorite.pin_id==Pin.id).filter(Favorite.user_id == current_user.id).all()
    return {'pins': [pin.to_dict() for pin in pins]}


@favorite_routes.route('/', methods=['POST'])
@login_required
def favorite_pin():
    data = request.get_json()
    pin_id = data.get('pin_id')
    pin = Pin.query.get(pin_id)
    if not pin:
        return {'errors': 'Pin not found'}, 404
    new_fav = Favorite(
        user_id=current_user.id,
        pin_id=pin_id
    )
    db.session.add(new_fav)
    db.session.commit()
    return new_fav.to_dict(), 201


@favorite_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def unfavorite_pin(id):
    favorite = Favorite.query.get(id)
    if not favorite:
        return {'errors': 'favorite not found'}, 404
    if favorite.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 403

    db.session.delete(favorite)
    db.session.commit()
    return {'message': 'favorite removed successfully'}
