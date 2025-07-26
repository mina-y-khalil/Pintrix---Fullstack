import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { thunkFetchBoards } from "../../redux/boards";
import "./BoardsList.css";

const BoardsList = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => Object.values(state.boards.entries || {}));

  useEffect(() => {
    dispatch(thunkFetchBoards());
  }, [dispatch]);

  const zeroPad = (n) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="boards-page">
      <h1 className="boards-title">Boards</h1>

      {boards.length ? (
        <div className="boards-grid">
          {boards.map((board) => {
            const firstPin = board.pins?.[0];
            const coverImage = firstPin?.imageUrl || firstPin?.image_url;
            const pinCount = board.pins?.length || 0;

            return (
              <div key={board.id} className="board-card">
                <div className="board-thumb">
                  <Link to={`/boards/${board.id}`}>
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={`${board.name} cover`}
                      className="board-cover-image"
                    />
                  ) : (
                    <div className="board-placeholder">No Image</div>
                  )}
                  </Link>
                  <div className="board-overlay">
                    <span className="board-name">{board.name}</span>
                    <span className="board-count">{zeroPad(pinCount)}</span>
                </div>
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
