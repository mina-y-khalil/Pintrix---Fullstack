import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkFetchBoards } from '../../redux/board';
import './ManageBoards.css';

const ManageBoards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => Object.values(state.board.entries));

  useEffect(() => {
    dispatch(thunkFetchBoards());
  }, [dispatch]);

  const handleManage = (boardId) => {
    navigate(`/boards/${boardId}/manage-pins`);
  };

  return (
    <div className="manage-boards">
      <h2>Your Boards</h2>
      {boards.length === 0 ? (
        <p>No boards yet.</p>
      ) : (
        <div className="boards-grid">
          {boards.map((board) => (
            <div key={board.id} className="board-card">
              <h3 className="board-name">{board.name}</h3>
              <button 
                className="manage-btn" 
                onClick={() => handleManage(board.id)}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBoards;