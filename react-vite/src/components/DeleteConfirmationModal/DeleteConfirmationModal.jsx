import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteComment, fetchCommentsByPin } from '../../redux/comments';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ commentId, pinId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        try {
            await dispatch(deleteComment(commentId));
            await dispatch(fetchCommentsByPin(pinId));
        } finally {
            closeModal();
        }
    };

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this comment?</p>
                <div className="modal-buttons">
                    <button onClick={handleDelete} className="confirm-btn">Yes</button>
                    <button onClick={closeModal} className="cancel-btn">No</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
