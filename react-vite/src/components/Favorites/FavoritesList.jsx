import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites} from '../../redux/favorites';

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  const pins = useSelector(state => Object.values(state.favorites || {}));

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
                <div>
                    <div>
                      <img src={pin.image_url}/>
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
