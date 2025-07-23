from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Favorite, Pin, db

favorite_routes = Blueprint('favorites', __name__)

@favorite_routes.route('/<int:id>')
@login_required
def get_favorite(id):
    fav = db.session.query(Favorite).filter(Favorite.pin_id==id).filter(Favorite.user_id == current_user.id).one_or_none()
    return {'fav_id': "" if fav is None else fav.id}


@favorite_routes.route('/')
@login_required
def view_favorites():
    print("#############"+str(current_user.id))
    print("#############"+current_user.username)
    result = db.session.query( Pin.image_url, Pin.title, Pin.likes_count).filter(Favorite.pin_id==Pin.id).filter(Favorite.user_id == current_user.id).all()
    pins = []
    for url, title, likes in result:
        pins.append({'image_url':url, 'title':title, 'likes_count':likes})
    return {'pins':pins}


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
