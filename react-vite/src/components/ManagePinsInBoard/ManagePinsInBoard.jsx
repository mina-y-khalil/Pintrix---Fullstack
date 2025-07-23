import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  thunkFetchBoard,
  thunkRemovePinFromBoard,
} from "../../redux/boards";
import "./ManagePinsInBoard.css";

const ManagePinsInBoard = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const board = useSelector((state) => state.boards.entries[boardId]);

  useEffect(() => {
    dispatch(thunkFetchBoard(boardId));
  }, [dispatch, boardId]);

  const handleDelete = (pinId) => {
    if (window.confirm("Are you sure you want to remove this pin?")) {
      dispatch(thunkRemovePinFromBoard(boardId, pinId));
    }
  };

  if (!board) return <p>Loading board...</p>;

  return (
    <div className="manage-pins-page">
      <h1>Manage Pins in &quot;{board.name}&quot;</h1>
      {board.pins && board.pins.length ? (
        <div className="pins-grid">
          {board.pins.map((pin) => (
            <div key={pin.id} className="pin-card">
              <img src={pin.imageUrl} alt={pin.title} className="pin-img" />
              <div className="pin-info">
                <span>{pin.title}</span>
                <button
                  className="delete-pin-btn"
                  onClick={() => handleDelete(pin.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pins found in this board.</p>
      )}
    </div>
  );
};

export default ManagePinsInBoard;
