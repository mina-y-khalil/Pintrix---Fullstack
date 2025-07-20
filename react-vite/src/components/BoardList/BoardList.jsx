import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from '../../redux/boards';
import { Link } from 'react-router-dom';
import './BoardList.css';


const BoardList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const boardsObj = useSelector(state => state.board.entries);
    const isLoading = useSelector(state => state.board.isLoading);
    const boards = Object.values(boardsObj);


    useEffect(() => {
      if (user) {
        dispatch(fetchBoards());
      }   
    }, [dispatch, user]);

    if (!user) {
      return <p>Please log in to view your boards.</p>
    }

    if (isLoading) return <p>Loading boards...</p>;

    return (
        <div className="board-list-container">
            <h2>Your Boards</h2>
            {boards.length === 0 ? (
                <p>You have no boards yet.</p>
            ) : (
                <div className="board-grid">
                    {boards.map((board) => (
                        <Link key={board.id} to={`/boards/${board.id}`} className="board-card">
                            <div className="board-thumbnail">
                                {/* Show first pin image if available, else fallback */}
                                {board.pins && board.pins.length > 0 ? (
                                    <img src={board.pins[0].imageUrl} alt={board.name} />
                                ) : (
                                    <div className="board-placeholder">No Pins</div>
                                )}
                            </div>
                            <div className="board-info">
                                <h3>{board.name}</h3>
                                <p>{board.pins?.length || 0} Pins</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

   

export default BoardList;