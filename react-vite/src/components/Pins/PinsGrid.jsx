import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite } from "../../redux/favorites";

export default function PinsGrid() {
  const dispatch = useDispatch();
  const pins = useSelector(state => Object.values(state.pins));
  const favorites = useSelector(state => state.favorites || {});
  const currentUser = useSelector(state => state.session.user);

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

  return (
    <div className="pins-grid">
      {pins.length ? (
        pins.map(pin => (
          <div key={pin.id} className="pin-card">
            <Link to={`/pins/${pin.id}`}>
              <h3>{pin.title}</h3>
              <img src={pin.imageUrl} alt={pin.title} />
            </Link>

            <p>{pin.description}</p>

            {/* Favorite Toggle */}
            <button onClick={() => handleFavoriteToggle(pin.id)}>
              {favorites[pin.id] ? "💔 Unfavorite" : "💖 Favorite"}
            </button>

            {/* Conditional Edit Button */}
            {currentUser?.id === pin.user_id && (
              <Link to={`/pins/${pin.id}/edit`}>
                <button>Edit</button>
              </Link>
            )}
          </div>
        ))
      ) : (
        <p>No pins yet. Let’s get creative!</p>
      )}
    </div>
  );
}