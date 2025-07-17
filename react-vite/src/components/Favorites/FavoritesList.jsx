import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../redux/favorites';

const FavoritesList = () => {
  const dispatch = useDispatch(); 
  const favorites = useSelector(state => Object.values(state.favorites || {}));

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(deleteFavorite(id));
  };

  return (
    <div>
      <h2>❤️ Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet!</p>
      ) : (
        <ul>
          {favorites.map(fav => (
            <li key={fav.id}>
              {fav.Pin?.title || `Pin ID: ${fav.pin_id}`}
              <button onClick={() => handleRemove(fav.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;
