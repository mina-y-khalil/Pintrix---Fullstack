import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../redux/favorites';

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  // Get all favorite pins from Redux state
  const pins = useSelector(state => Object.values(state.favorites || {}));

  // Fetch favorites when the component mounts
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div>
      <h2>❤️ Your Favorite pins</h2>
      {pins.length === 0 ? (
        <p>No favorited pin yet!</p>
      ) : (
        <div>
          {pins.map(pin => (
            // Add a unique key prop to each element in the list
            <div key={pin.id}>
              <div>
                <img src={pin.image_url} alt={pin.title} />
              </div>
              <div>
                <span>{pin.title}</span>
                <span>{pin.likes_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;