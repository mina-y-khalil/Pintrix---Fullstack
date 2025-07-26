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

    result = db.session.query(Favorite.id, Pin.image_url, Pin.title, Pin.likes_count).filter(Favorite.pin_id==Pin.id).filter(Favorite.user_id == current_user.id).all()
    pins = []
    for id, url, title, likes in result:
        pins.append({'id':id, 'image_url':url, 'title':title, 'likes_count':likes})
    return {'pins':pins}

        favorites = Favorite.query.filter_by(user_id=current_user.id).all()
        return {'favs': [fav.to_dict() for fav in favorites]}



@favorite_routes.route('/', methods=['POST'])
@login_required
def favorite_pin():
    data = request.get_json()
    pin_id = data.get('pin_id')

    fav = db.session.query(Favorite).filter(Favorite.pin_id==pin_id).filter(Favorite.user_id == current_user.id).one_or_none()

    pin = Pin.query.get(pin_id)
    if not pin:
        return {'errors': 'Pin not found'}, 404
    
    # Check if user already favorited this pin
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user.id, 
        pin_id=pin_id
    ).first()
    
    if existing_favorite:
        return {'message': 'Already favorited'}, 200
    
    # Create new favorite

    new_fav = Favorite(
        user_id=current_user.id,
        pin_id=pin_id
    )

    if fav is  None:
        pin = Pin.query.get(pin_id)
        if not pin:
            return {'errors': 'Pin not found'}, 404
        db.session.add(new_fav)
        db.session.commit()
        db.session.flush()
        fav = db.session.get(new_fav.id)
        return fav.to_dict(), 201
    else:
        return {'errors': 'Duplicate favorite entry'}, 409

    
    # Add favorite and update pin likes count
    db.session.add(new_fav)
    pin.likes_count += 1  # Increment the likes count
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

    # Get the pin and decrement likes count
    pin = Pin.query.get(favorite.pin_id)
    if pin and pin.likes_count > 0:
        pin.likes_count -= 1
    
    db.session.delete(favorite)
    db.session.commit()
    return {'message': 'favorite removed successfully'}