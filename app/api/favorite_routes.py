from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Favorite, db

favorite_routes = Blueprint('favorites', __name__)

@favorite_routes.route('/')
@login_required
def view_favorites():
    favs = db.session.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return {'favs': [fav.to_dict() for fav in favs]}


@favorite_routes.route('/', methods=['POST'])
@login_required
def favorite_pin():
    data = request.get_json()
    new_fav = Favorite(
        user_id=current_user.id,
        pin_id=data.get('pin_id')
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
