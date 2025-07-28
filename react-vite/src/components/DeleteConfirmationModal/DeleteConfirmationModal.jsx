import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteComment, fetchCommentsByPin } from '../../redux/comments';
import { deletePin, fetchPins } from '../../redux/pins';
import { thunkDeleteBoard, thunkFetchBoards, thunkRemovePinFromBoard } from '../../redux/boards';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ type, pinId, commentId, boardId, navigateAfterDelete }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      if (type === 'comment') {
        await dispatch(deleteComment(commentId));
        await dispatch(fetchCommentsByPin(pinId));
      } else if (type === 'pin') {
        await dispatch(deletePin(pinId));
        await dispatch(fetchPins());
        if (navigateAfterDelete) navigateAfterDelete();
      } else if (type === 'board') {
        await dispatch(thunkDeleteBoard(boardId)); 
        await dispatch(thunkFetchBoards());
        if (navigateAfterDelete) navigateAfterDelete();
      } else if (type === 'pin-in-board') {
        await dispatch(thunkRemovePinFromBoard(boardId, pinId));
      }
    } finally {
      closeModal();
    }
  };

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content">
                <h2>Confirm Delete</h2>
                <p>
                    {type === 'comment' && "Are you sure you want to delete this comment?"}
                    {type === 'pin' && "Are you sure you want to delete this pin?"}
                    {type === 'board' && "Are you sure you want to delete this board? This action cannot be undone."}
                    {type === 'pin-in-board' && "Remove this pin from the board?"}
                </p>
                <div className="modal-buttons">
                    <button onClick={handleDelete} className="confirm-btn">Yes</button>
                    <button onClick={closeModal} className="cancel-btn">No</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
