import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPins, deletePin } from "../../redux/pins";
import { createFavorite, deleteFavorite } from "../../redux/favorites";
import "./PinsGrid.css";
import "./PinDetail.css";

export default function PinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely access pins state to prevent "Cannot read properties of undefined" error
  const pins = useSelector((state) => state?.pins || {});
  
  // Handle both object and array formats for pins data
  let pin = null;
  if (pins && typeof pins === 'object') {
    pin = pins[id];
  } else if (Array.isArray(pins)) {
    pin = pins.find(p => p.id === Number(id));
  }
  
  const currentUser = useSelector((state) => state?.session?.user);
  const isFavorited = useSelector((state) => !!state?.favorites?.[id]);
  const comments = useSelector((state) => {
    const commentsState = state?.comments || {};
    return Object.values(commentsState).filter(
      (comment) => comment.pinId === Number(id)
    );
  });

  useEffect(() => {
    if (!pin) {
      dispatch(fetchPins());
    }
  }, [dispatch, pin]);

  const handleFavoriteClick = () => {
    if (isFavorited) {
      dispatch(deleteFavorite(id));
    } else {
      dispatch(createFavorite(id));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      dispatch(deletePin(pin.id));
      navigate("/pins");
    }
  };

  if (!pin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pin-detail">
      {/* Header with title and heart button positioned at top right */}
      <div className="pin-header">
        <h2>{pin.title}</h2>
        <button 
          className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          ♥
        </button>
      </div>
      
      {/* Fixed image property name from imageUrl to image_url */}
      <img src={pin.image_url} alt={pin.title} />
      <p>{pin.description}</p>

      {/* Action buttons only for pin owner */}
      {currentUser?.id === pin.user_id && (
        <div className="action-buttons">
          <Link to={`/pins/${pin.id}/edit`}>
            <button>Edit This Pin</button>
          </Link>
          <button onClick={handleDelete}>Delete This Pin</button>
        </div>
      )}

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first!</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user?.username || "Anonymous"}:</strong>{" "}
                {comment.body}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}