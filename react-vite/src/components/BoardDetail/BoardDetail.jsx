import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  thunkFetchBoards,
  thunkUpdateBoard,
} from "../../redux/boards";
import OpenModalButton from "../OpenModalButton";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
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

  if (!board) return <p>Loading board details...</p>;

  const pins = board.pins || [];

  const handleRenameClick = () => setIsEditing(true);

  const handleInputChange = (e) => setNewName(e.target.value);

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
            <button className="ok-button" onClick={handleOkClick}>OK</button>
          ) : (
            <>
              <button className="rename-button" onClick={handleRenameClick}>
                Rename Board
              </button>

              <OpenModalButton
                buttonText="Delete Board"
                modalComponent={
                  <DeleteConfirmationModal
                    type="board"
                    boardId={board.id}
                    navigateAfterDelete={() => navigate("/boards")}
                  />
                }
                className="delete-button"
              />
            </>
          )}
        </div>
      </div>

      <Link to="/boards" className="back-to-boards">← Back to Boards</Link>

      {pins.length > 0 ? (
        <div className="pins-grid">
          {pins.map((pin) => (
  <div key={pin.id} className="pin-card-wrapper">
  <Link to={`/pins/${pin.id}`} className="pin-card">
    {pin.image_url && (
      <img src={pin.image_url} alt={pin.title} className="pin-image" />
    )}
    <div className="pin-info">
      <h3 className="pin-title">{pin.title}</h3>
    </div>
  </Link>
  <OpenModalButton
    buttonText="Delete Pin"
    modalComponent={
      <DeleteConfirmationModal
        type="pin-in-board"
        boardId={board.id}
        pinId={pin.id}
      />
    }
    className="pin-delete-button"
    title="Remove pin from board"
  />
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
