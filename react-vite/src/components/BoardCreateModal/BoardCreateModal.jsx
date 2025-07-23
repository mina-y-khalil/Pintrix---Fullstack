import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkCreateBoard } from '../../redux/boards'; 
import './BoardCreateModal.css'; 

function BoardCreateModal({ onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Board name cannot be empty.');
      return;
    }

    const result = await dispatch(thunkCreateBoard(name.trim()));

    if (result && result.errors) {
      setError(result.errors[0]);
    } else {
      onClose(); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Board</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="board-name">Board Name:</label>
          <input
            type="text"
            id="board-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-buttons">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardCreateModal;