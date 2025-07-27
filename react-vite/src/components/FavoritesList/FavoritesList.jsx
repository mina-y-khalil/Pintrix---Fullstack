import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../redux/favorites';
import './FavoritesList.css'
import { Link } from 'react-router-dom';

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  const pins = useSelector(state => Object.values(state.favorites.entries));
  
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleUnfavorite = (pinId) => {
    dispatch(deleteFavorite(pinId));
  };

  return (
    <div>
        <h1> Favorites </h1>
        <div>
             {pins.length==0 ? (
              <p>No favorited pin yet!</p>
            ) : (
              <div className='favContainer'>
                {pins.map(pin => (
                  <div key={pin.id} className='favColumn'>
                       <div>
                        <Link to={`/pins/${pin.pin_id}`}>
                           <img  src={pin.image_url} alt={pin.title} className="favImage"/>
                           </Link>
                          <div className="favText">
                            <span className='favTitle'>{pin.title}</span>
                            <span className='favLikes clickableHeart' onClick={() => handleUnfavorite(pin.id)} title="Remove from favorites">❤️{"  "+pin.likes_count}</span>
                          </div>
                      </div>
                  </div>
                ))}
              </div>
            )}
        </div>
    </div>
  );
};

export default FavoritesList;