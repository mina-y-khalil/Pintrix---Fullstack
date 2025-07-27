import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import "./PinsGridPersonal.css";

export default function PinsGrid() {
  const dispatch = useDispatch();

  const pins = useSelector(state => Object.values(state.pins));
  const favorites = useSelector(state =>
    Object.values(state.favorites.entries || {})
  );
  const currentUser = useSelector(state => state.session.user);

  // Fetch pins and user favorites (if logged in)
  useEffect(() => {
    dispatch(fetchPins());
    if (currentUser) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, currentUser]);

  // Filter pins to only include those created by the current user
  const userPins = useMemo(() => {
    return pins.filter(pin => pin.user_id === currentUser?.id);
  }, [pins, currentUser]);

  // Check if a pin is already favorited
  const isPinFavorited = (pinId) => {
    return favorites.some(fav => fav.pin_id === pinId);
  };

  // Favorite or unfavorite the pin
  const handleFavoriteClick = (pinId) => {
    const existingFavorite = favorites.find(fav => fav.pin_id === pinId);
    if (existingFavorite) {
      dispatch(deleteFavorite(existingFavorite.id));
    } else {
      dispatch(createFavorite(pinId));
    }
  };

  return (
       <div className="pins-grid-container">
      <h2 className="pins-title">Your Awesome Pins!</h2>
    <div className="pins-grid">
      {userPins.length ? (
        userPins.map(pin => (
          <div key={pin.id} className="pin-card">
            <div className="pin-header">
              <Link to={`/pins/${pin.id}`}>
                <h3>{pin.title}</h3>
              </Link>

              {currentUser && (
                <button
                  className={`favorite-button ${isPinFavorited(pin.id) ? 'favorited' : ''}`}
                  onClick={() => handleFavoriteClick(pin.id)}
                >
                  ♥
                </button>
              )}
            </div>

            <Link to={`/pins/${pin.id}`}>
              <img src={pin.image_url} alt={pin.title} />
            </Link>

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
    </div>
  );
}
