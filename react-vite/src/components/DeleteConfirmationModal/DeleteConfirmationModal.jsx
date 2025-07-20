import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteComment, fetchCommentsByPin } from '../../redux/comments';

const DeleteConfirmationModal = ({ commentId, pinId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(deleteComment(commentId));
        await dispatch(fetchCommentsByPin(pinId));
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className="delete-modal-container">
            <p>Are you sure<br />you want to proceed?</p>
            <div className="delete-modal-buttons">
                <button className="yes-button" onClick={handleDelete}>Yes</button>
                <button className="no-button" onClick={handleCancel}>No</button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
