import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  thunkFetchBoards,
  thunkUpdateBoard,
  thunkDeleteBoard,
  thunkRemovePinFromBoard
} from "../../redux/boards";
import "./BoardDetail.css";

const BoardDetails = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const board = useSelector((state) => state.boards.entries[boardId]);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!board) {
      dispatch(thunkFetchBoards());
    } else {
      setNewName(board.name);
    }
  }, [dispatch, board]);

  if (!board) {
    return <p>Loading board details...</p>;
  }

  const pins = board.pins || [];

  const handleRenameClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setNewName(e.target.value);
  };

  
  const handleOkClick = async () => {
    if (newName.trim() && newName !== board.name) {
      await dispatch(thunkUpdateBoard(boardId, { name: newName.trim() }));
    }
    setIsEditing(false);
  };

  
  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setNewName(board.name);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this board? This action cannot be undone."
    );
    if (confirmed) {
      await dispatch(thunkDeleteBoard(boardId));
      navigate("/boards");
    }
  };

  return (
    <div className="board-details-page">
      <div className="board-header">
        {isEditing ? (
          <input
            className="rename-input"
            value={newName}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
        ) : (
          <h1 className="board-details-title">{board.name}</h1>
        )}
        <div className="board-actions">
          {isEditing ? (
            <>
              <button className="ok-button" onClick={handleOkClick}>
                OK
              </button>
              {/* Hide delete button while editing */}
            </>
          ) : (
            <>
              <button className="rename-button" onClick={handleRenameClick}>
                Rename Board
              </button>
              <button className="delete-button" onClick={handleDeleteClick}>
                Delete Board
              </button>
            </>
          )}
        </div>
      </div>

      <Link to="/boards" className="back-to-boards">
        ← Back to Boards
      </Link>

      {pins.length > 0 ? (
        <div className="pins-grid">
          {pins.map((pin) => (
          <div key={pin.id} className="pin-card-wrapper" style={{ position: 'relative' }}>
      {/* Delete "x" button */}
      <button
        className="pin-delete-button"
        onClick={async (e) => {
          e.stopPropagation(); // Prevent triggering the link
          e.preventDefault();
          if (
            window.confirm(
              'Are you sure you want to remove this pin from the board?'
            )
          ) {
            await dispatch(thunkRemovePinFromBoard(boardId, pin.id));
          }
        }}
        title="Remove pin from board"
      >
        ×
      </button>

      {/* Link wrapping the pin content */}
      <Link
        to={`/pins/${pin.id}`}
        className="pin-card"
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {pin.image_url && (
          <img src={pin.image_url} alt={pin.title} className="pin-image" />
        )}
        <div className="pin-info">
          <h3 className="pin-title">{pin.title}</h3>
        </div>
      </Link>
    </div>
  ))}
</div>
      ) : (
        <p className="no-pins">No pins in this board yet.</p>
      )}
    </div>
  );
};

export default BoardDetails;
