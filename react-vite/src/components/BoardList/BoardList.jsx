import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from '../../redux/boardReducer';
import { Link } from 'react-router-dom';
import './BoardList.css';


const BoardList = () => {
    const dispatch = useDispatch();
    const boardsObj = useSelector(state=>state.boardState.entries);
    const boards = Object.values(boardsObj);


    useEffect(() => {
        dispatch(fetchBoards());
        }, [dispatch]);


        return (
    <div className="board-list-container">
      <div className="board-grid">
        {boards.map(board => {
          const firstThreePins = board.pins ? board.pins.slice(0, 3) : [];
          return (
            <Link to={`/boards/${board.id}`} key={board.id} className="board-card">
              <div className="board-images">
                {firstThreePins.length > 0 ? (
                  firstThreePins.map((pin, idx) => (
                    <img
                      key={idx}
                      src={pin.imageUrl}
                      alt={`Pin ${idx + 1} in board ${board.name}`}
                      className={`pin-image pin-${idx + 1}`}
                    />
                  ))
                ) : (
                  <div className="empty-board">No Pins Yet</div>
                )}
              </div>
              <div className="board-name">{board.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BoardList;