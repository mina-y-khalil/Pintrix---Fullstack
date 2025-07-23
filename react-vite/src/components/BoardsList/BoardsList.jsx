import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkFetchBoards } from '../../redux/boards'; 
import { Link } from 'react-router-dom';
import './BoardsList.css';  

const BoardsList = () => {
  const dispatch = useDispatch();
  const boards = useSelector(state => Object.values(state.boards.entries));

  useEffect(() => {
    dispatch(thunkFetchBoards());
  }, [dispatch]);

  if (!boards.length) return <p className="no-boards">You have no boards yet.</p>;

  return (
    <div className="boards-list">
      {boards.map(board => {
         const coverImage = board.pins?.[0]?.image_url || null;

        return (
          <Link key={board.id} to={`/boards/${board.id}`} className="board-card">
            {coverImage ? (
              <img
                src={coverImage}
                alt={`${board.name} cover`}
                className="board-cover-image"
              />
            ) : (
              <div className="board-cover-placeholder">No cover image</div>
            )}
            <div className="board-name">{board.name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default BoardsList;
