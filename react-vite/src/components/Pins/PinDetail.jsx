import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPins, deletePin } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import "./PinsGrid.css";
import "./PinDetail.css";

export default function PinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pins = useSelector((state) => state?.pins || {});
  let pin = null;
  if (pins && typeof pins === "object") {
    pin = pins[id];
  } else if (Array.isArray(pins)) {
    pin = pins.find((p) => p.id === Number(id));
  }

  const currentUser = useSelector((state) => state?.session?.user);
  
  // FIXED: Get all favorites as an array, not an object
  const allFavorites = useSelector((state) => state?.favorites || []);
  
  // Add debugging here
  console.log('=== DEBUG FAVORITES ===');
  console.log('All favorites:', allFavorites);
  console.log('Current pin ID:', id, 'Type:', typeof id);
  
  // Check if this specific pin is favorited by the current user
  const isFavorited = allFavorites.some(fav => {
    console.log('Checking favorite:', fav, 'fav.pin_id:', fav.pin_id, 'Type:', typeof fav.pin_id);
    return fav.pin_id === Number(id);
  });
  
  // Count favorites for THIS specific pin
  const favoritesCount = allFavorites.filter(fav => {
    const matches = fav.pin_id === Number(id);
    console.log('Favorite pin_id:', fav.pin_id, 'matches current pin:', matches);
    return matches;
  }).length;
  
  console.log('Final favorites count for pin', id, ':', favoritesCount);
  
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
    dispatch(fetchFavorites());
  }, [dispatch, pin]);

  const handleFavoriteClick = () => {
    if (isFavorited) {
      // Find the favorite ID to delete - FIXED: Use allFavorites array
      const favoriteToDelete = allFavorites.find(fav => fav.pin_id === Number(id));
      if (favoriteToDelete) {
        dispatch(deleteFavorite(favoriteToDelete.id));
      }
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
    <div className="pin-detail-container">
      <div className="pin-detail-content">
        {/* Left Column - Pin Information */}
        <div className="pin-info">
          <div className="pin-title">{pin.title}</div>
          <div className="pin-owner">Pin owner: Unknown</div>

          <div className="pin-stats">
            <span className="favorites-count">
              <span className="heart-icon">♥</span> {favoritesCount}
            </span>
          </div>

          <div className="pin-description">
            <div className="pin-description-text">{pin.description}</div>
          </div>

          {/* Only show comment button if user is NOT the pin owner */}
          {currentUser?.id !== pin.user_id && (
            <button className="add-comment-btn">Add Comment</button>
          )}
        </div>

        {/* Right Column - Image and Actions */}
        <div className="pin-image-section">
          <div className="image-container">
            <img src={pin.image_url} alt={pin.title} />
            <button className="share-btn">↪</button>
          </div>

          <div className="action-buttons">
            <button
              className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
              onClick={handleFavoriteClick}
            >
              {isFavorited ? "Remove from Favorites" : "Add To Favorites"}
            </button>

            <button className="add-to-board-btn">Add To Board</button>

            {currentUser?.id === pin.user_id && (
              <div className="owner-actions">
                <Link to={`/pins/${pin.id}/edit`}>
                  <button className="edit-btn">Edit This Pin</button>
                </Link>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete This Pin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments:</h3>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user?.username || "Anonymous"}
                  </span>
                  <span className="comment-date">
                    Date {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-body">{comment.body}</p>
                {currentUser?.id === comment.user_id && (
                  <div className="comment-actions">
                    <button className="edit-comment">Edit</button>
                    <button className="delete-comment">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}