import './DeleteBoardModal.css';


const DeleteBoardModal = ({ boardId, onClose, onConfirm }) => {
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this board?</p>
                <div className='modal-button'>
                    <button className='delete-btn' onClick={() => onConfirm(boardId)}>Yes (Delete Board)</button>
                    <button className='cancel-btn' onClick={onClose}>No (Keep Board)</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBoardModal;