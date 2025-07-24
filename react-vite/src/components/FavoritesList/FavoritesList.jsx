import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../redux/favorites';
import './FavoritesList.css'

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  // Get all favorite pins from Redux state
  const pins = useSelector(state => Object.values(state.favorites.entries));
  
  // Fetch favorites when the component mounts
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

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
                            <span className='favLikes'>❤️{"  "+pin.likes_count}</span>
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