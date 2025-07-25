import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import "./PinsGrid.css";

export default function PinsGrid() {
  const dispatch = useDispatch();
  const pins = useSelector(state => Object.values(state.pins));
  const favorites = useSelector(state => Object.values(state.favorites || {}));
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchPins());
    dispatch(fetchFavorites()); 
  }, [dispatch]);

  const handleFavoriteClick = (pinId) => {
    // Check if this pin is favorited by the current user
    const existingFavorite = favorites.find(fav => fav.pin_id === pinId);
    
    if (existingFavorite) {
      // If favorited, delete the favorite
      dispatch(deleteFavorite(existingFavorite.id));
    } else {
      // If not favorited, create a new favorite
      dispatch(createFavorite(pinId));
    }
  };

  const isPinFavorited = (pinId) => {
    return favorites.some(fav => fav.pin_id === pinId);
  };

  return (
    <div className="pins-grid">
      {pins.length ? (
        pins.map(pin => (
          <div key={pin.id} className="pin-card">
            <div className="pin-header">
              <Link to={`/pins/${pin.id}`}>
                <h3>{pin.title}</h3>
              </Link>
              <button 
                className={`favorite-button ${isPinFavorited(pin.id) ? 'favorited' : ''}`}
                onClick={() => handleFavoriteClick(pin.id)}
              >
                ♥
              </button>
            </div>
            
            <Link to={`/pins/${pin.id}`}>
              <img src={pin.image_url} alt={pin.title} /> 
            </Link>

            {/* Conditional Edit Button */}
            {currentUser?.id === pin.user_id && (
              <div className="edit-link-container">
                <Link to={`/pins/${pin.id}/edit`} className="edit-link">
                  Edit
                </Link>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No pins yet. Let&apos;s get creative!</p>
      )}
    </div>
  );
}