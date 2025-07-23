import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { thunkFetchBoards } from "../../redux/boards";
import "./BoardDetail.css";

const BoardDetails = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const board = useSelector((state) => state.boards.entries[boardId]);

  useEffect(() => {
    if (!board) {
      dispatch(thunkFetchBoards());
    }
  }, [dispatch, board]);

  if (!board) {
    return <p>Loading board details...</p>;
  }

  const pins = board.pins || [];

  return (
    <div className="board-details-page">
      <h1 className="board-details-title">{board.name}</h1>
      <Link to="/boards" className="back-to-boards">
        ← Back to Boards
      </Link>

      {pins.length > 0 ? (
        <div className="pins-grid">
          {pins.map((pin) => (
            <div key={pin.id} className="pin-card">
              {pin.image_url && (
                <img src={pin.image_url} alt={pin.title} className="pin-image" />
              )}
              <div className="pin-info">
                <h3 className="pin-title">{pin.title}</h3>
              </div>
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
