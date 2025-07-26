import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkCreateBoard } from '../../redux/boards'; 
import './BoardCreateForm.css'; 



function BoardCreateForm({ onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      if (onSuccess) onSuccess();
      navigate('/boards');
    }
  };

  const handleCancel = () => {
    navigate('/boards');
  };

  return (
    <form onSubmit={handleSubmit} className="board-create-form">
      <h2>Create New Board</h2>
      <label htmlFor="board-name">Board Name:</label>
      <input
        type="text"
        id="board-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        placeholder="Enter board name"
      />
      {error && <p className="error">{error}</p>}
      <div className="form-buttons">
        <button type="submit">Create</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default BoardCreateForm;
