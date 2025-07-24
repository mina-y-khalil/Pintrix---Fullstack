import { useEffect, useState } from "react";
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
  const [expandedPins, setExpandedPins] = useState(new Set());

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  const handleFavoriteToggle = (pinId) => {
    if (favorites[pinId]) {
      dispatch(deleteFavorite(pinId));
    } else {
      dispatch(createFavorite(pinId));
    }
  };

  const handlePinClick = (pinId) => {
    setExpandedPins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pinId)) {
        newSet.delete(pinId);
      } else {
        newSet.add(pinId);
      }
      return newSet;
    });
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
                onClick={() => handleFavoriteToggle(pin.id)}
              >
                ♥
              </button>
            </div>
            
            <div className="pin-content" onClick={() => handlePinClick(pin.id)}>
              <img src={pin.image_url} alt={pin.title} /> 
              
              {expandedPins.has(pin.id) && (
                <div className="pin-description">
                  <p>{pin.description}</p>
                </div>
              )}
            </div>

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
        <p>Pins Loading ...</p>
      )}
    </div>
  );
}