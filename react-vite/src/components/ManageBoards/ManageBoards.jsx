import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchBoards, thunkDeleteBoard } from "../../redux/boards";
import "./ManageBoards.css";

const BoardsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boardsObj = useSelector((state) => state.boards?.entries || {});
  const boards = Object.values(boardsObj);

  useEffect(() => {
    dispatch(thunkFetchBoards());
  }, [dispatch]);

  const zeroPad = (n) => (n < 10 ? `0${n}` : `${n}`);

  const handleUpdate = (board) => {
    navigate(`/boards/${board.id}/manage-pins`);
  };

  const handleDelete = (board) => {
    if (
      window.confirm(
        `Are you sure you want to delete the board "${board.name}"?`
      )
    ) {
      dispatch(thunkDeleteBoard(board.id));
    }
  };

  return (
    <div className="boards-page">
      <h1 className="boards-title">Manage Boards</h1>

      {boards.length ? (
        <div className="boards-grid">
          {boards.map((board) => {
            const pinCount = board.pins ? board.pins.length : 0;
            const coverImage = board.pins?.[0]?.image_url || null;

            return (
              <div key={board.id} className="board-card">
                <div className="board-thumb">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={`${board.name} cover`}
                      className="board-cover-image"
                    />
                  ) : (
                    <div className="board-placeholder">No Image</div>
                  )}
                  <div className="board-overlay">
                    <span className="board-name">{board.name}</span>
                    <span className="board-count">{zeroPad(pinCount)}</span>
                  </div>
                </div>

                <div className="board-actions">
                  <button
                    type="button"
                    className="board-btn update"
                    onClick={() => handleUpdate(board)}
                  >
                    Manage Pins
                  </button>
                  <button
                    type="button"
                    className="board-btn delete"
                    onClick={() => handleDelete(board)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-boards">No boards found.</p>
      )}
    </div>
  );
};

export default BoardsList;
