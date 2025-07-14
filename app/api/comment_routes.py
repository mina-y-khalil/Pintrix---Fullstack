from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Comment

comment_routes = Blueprint('comments', __name__)

# View Comments for a Pin - MK
# I didn't add "@login_required" here because comments can be viewed by anyone
@comment_routes.route('/pins/<int:pin_id>/comments', methods=['GET'])
def get_comments(pin_id):
    comments = Comment.query.filter_by(pin_id=pin_id).all()
    return {'comments': [comment.to_dict() for comment in comments]} # convert each comment to a dictionary

# Add new comment - MK
@comment_routes.route('/pins/<int:pin_id>/comments', methods=['POST'])
@login_required
def create_comment(pin_id):
    data = request.get_json()
    text = data.get('text')

    if not text:
        return {"errors": ["Text is required"]}, 400

    comment = Comment(
        user_id=current_user.id,
        pin_id=pin_id,
        text=text
    )
    db.session.add(comment)
    db.session.commit()
    return comment.to_dict(), 201

# Update comment - MK
@comment_routes.route('/comments/<int:id>', methods=['PUT'])
@login_required
def update_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return {"errors": ["Comment not found"]}, 404
    if comment.user_id != current_user.id:
        return {"errors": ["Unauthorized"]}, 403

    data = request.get_json()
    text = data.get('text')
    if not text:
        return {"errors": ["Text is required"]}, 400

    comment.text = text
    db.session.commit()
    return comment.to_dict()

# Delete comment - MK
@comment_routes.route('/comments/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return {"errors": ["Comment not found"]}, 404
    if comment.user_id != current_user.id:
        return {"errors": ["Unauthorized"]}, 403

    db.session.delete(comment)
    db.session.commit()
    return {"message": "Successfully deleted"}
