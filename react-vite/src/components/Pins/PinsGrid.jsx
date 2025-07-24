import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite } from "../../redux/favorites";
import "./PinsGrid.css";

export default function PinsGrid() {
  const dispatch = useDispatch();
  const pins = useSelector(state => Object.values(state.pins));
  const favorites = useSelector(state => state.favorites || {});
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  const handleFavoriteClick = (pinId) => {
    if (favorites[pinId]) {
      dispatch(deleteFavorite(pinId));
    } else {
      dispatch(createFavorite(pinId));
    }
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
                className={`favorite-button ${favorites[pin.id] ? 'favorited' : ''}`}
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