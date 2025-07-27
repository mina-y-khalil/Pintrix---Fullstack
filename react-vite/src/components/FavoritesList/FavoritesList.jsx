import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../redux/favorites';
import './FavoritesList.css'

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  const pins = useSelector(state => Object.values(state.favorites.entries));
  
  // Fetch favorites when the component mounts
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
                  // Add a unique key prop to each element in the list
                  <div key={pin.id} className='favColumn'>
                       <div>
                           <img  src={pin.image_url} alt={pin.title} />
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