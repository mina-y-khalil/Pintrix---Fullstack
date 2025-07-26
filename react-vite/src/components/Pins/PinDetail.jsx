import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
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

  // const isFavorited = useSelector((state) => !!state?.favorites?.[id]);
  // Use the same approach as your teammate for favorites count
  const favorites = useSelector(state => Object.values(state.favorites || {}));

  
  const fullState = useSelector((state) => state);
  const allFavorites = useMemo(() => fullState?.favorites || {}, [fullState?.favorites]);
  const favoritesArray = useMemo(() => Object.values(allFavorites), [allFavorites]);
  
  const isFavorited = useMemo(() => {
    return favoritesArray.some(fav => fav.pin_id === Number(id));
  }, [favoritesArray, id]);
  
  const favoritesCount = useMemo(() => {
    return favoritesArray.filter(fav => fav.pin_id === Number(id)).length;
  }, [favoritesArray, id]);
  

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

    // Fetch favorites when component mounts


    dispatch(fetchFavorites());
  }, [dispatch, pin]);

  const handleFavoriteClick = () => {
    if (isFavorited) {
      const favoriteToDelete = favoritesArray.find(fav => fav.pin_id === Number(id));
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

          <h1 className="pin-title">{pin.title}</h1>
          <p className="pin-owner">Pin owner: {pin.user?.username || "Unknown"}</p>
          
          <div className="pin-stats">
            <span className="favorites-count">
              <span className="heart-icon">♥</span> {favorites.length}
            </span>
          </div>
          
          <div className="pin-description">
            <p>{pin.description}</p>
          </div>
          
          <button className="add-comment-btn">
            Add Comment
          </button>

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

                  <span className="comment-author">{comment.user?.username || "Anonymous"}</span>
                  <span className="comment-date">Date {new Date(comment.createdAt).toLocaleDateString()}</span>

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