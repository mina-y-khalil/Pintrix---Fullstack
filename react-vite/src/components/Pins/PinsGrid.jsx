import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import "./PinsGrid.css";

export default function PinsGrid() {
  const dispatch = useDispatch();

  const pins = useSelector(state => Object.values(state.pins));
  const favorites = useSelector(state =>
    Object.values(state.favorites.entries || {})
  );
  const currentUser = useSelector(state => state.session.user);
  const shuffledRef = useRef(null);
  const [shuffledOnce, setShuffledOnce] = useState(false);

  // Fetch pins 
  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  // Fetch favorites if user is logged in
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, currentUser]);

  // Shuffle pins only once
  useEffect(() => {
  if (!shuffledRef.current && pins.length && !shuffledOnce) {
    const array = [...pins];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    shuffledRef.current = array;
    setShuffledOnce(true); 
  }
}, [pins, shuffledOnce]);

  const shuffledPins = shuffledRef.current || [];

  // Check if a pin is already favorited
  const isPinFavorited = (pinId) => {
    return favorites.some(fav => fav.pin_id === pinId);
  };

  // Favorite or unfavorite the pin
  const handleFavoriteClick = async (e, pinId) => {
    e.preventDefault();
    const existingFavorite = favorites.find(fav => fav.pin_id === pinId);
    if (existingFavorite) {
      await dispatch(deleteFavorite(existingFavorite.id));
    } else {
      const result = await dispatch(createFavorite(pinId));

      if (!result?.fav && !result?.alreadyFavorited) {
        console.error('Failed to favorite pin');
      }
    }
  };

  return (
    <div className="pins-grid">
      {shuffledPins.length ? (
        shuffledPins.map(pin => (
          <div key={pin.id} className="pin-card">
            <div className="pin-header">
              <Link to={`/pins/${pin.id}`}>
                <h3>{pin.title}</h3>
              </Link>

              {/* Show favorite button only if logged in */}
              {currentUser && (
                <button
                  type='button'
                  className={`favorite-button ${isPinFavorited(pin.id) ? 'favorited' : ''}`}
                  onClick={(e) => handleFavoriteClick(e, pin.id)}
                >
                  ♥
                </button>
              )}
            </div>

            <Link to={`/pins/${pin.id}`}>
              <img src={pin.image_url} alt={pin.title} />
            </Link>

            {/* Show Edit link only if user owns the pin */}
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
