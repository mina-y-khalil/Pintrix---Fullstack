import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPin } from '../../redux/comments';
import OpenModalButton from '../OpenModalButton';
import CommentForm from '../CommentForm';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import './CommentList.css';

const CommentList = ({ pinId, currentUserId }) => {
    const dispatch = useDispatch();
    const commentsObj = useSelector((state) => state.comments || {});
    const comments = Object.values(commentsObj).filter(comment => comment.pin_id === pinId);

    useEffect(() => {
        if (pinId) dispatch(fetchCommentsByPin(pinId));
    }, [dispatch, pinId]);

    return (
        <div className="comment-list-container">
            {currentUserId && (
                <OpenModalButton
                    buttonText="💬 Add Comment"
                    className="add-comment-button"
                    modalComponent={<CommentForm pinId={pinId} />}
                />
            )}


            <h3 className="comments-title">Comments:</h3>

            {comments.length === 0 ? (
                <p className="no-comments">No comments yet.</p>
            ) : (
                comments
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-user">{comment.username}</span>
                                <span className="comment-date">
                                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>

                                {currentUserId === comment.user_id && (
                                    <div className="comment-actions">
                                        <OpenModalButton
                                            buttonText="Edit"
                                            className="edit-comment-button"
                                            modalComponent={<CommentForm pinId={pinId} comment={comment} />}
                                        />

                                        <OpenModalButton
                                            buttonText="Delete"
                                            modalComponent={<DeleteConfirmationModal commentId={comment.id} pinId={pinId} />}
                                            className="delete-comment-button"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="comment-text">{comment.text}</div>
                        </div>
                    ))
            )}
        </div>
    );
};

export default CommentList;
