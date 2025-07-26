import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchPins, deletePin } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import { fetchCommentsByPin } from "../../redux/comments";
import "./PinsGrid.css";
import "./PinDetail.css";
// import OpenModalButton from "../OpenModalButton";
// import CommentForm from "../CommentForm";
import CommentList from "../CommentList";

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

  const fullState = useSelector((state) => state);
  const allFavorites = useMemo(() => fullState?.favorites || {}, [fullState?.favorites]);
  const favoritesArray = useMemo(() => Object.values(allFavorites), [allFavorites]);

  const isFavorited = useMemo(() => {
    return favoritesArray.some(fav => fav.pin_id === Number(id));
  }, [favoritesArray, id]);

  const favoritesCount = useMemo(() => {
    return favoritesArray.filter(fav => fav.pin_id === Number(id)).length;
  }, [favoritesArray, id]);

  useEffect(() => {
    if (!pin) {
      dispatch(fetchPins());
    }
    dispatch(fetchFavorites());
    dispatch(fetchCommentsByPin(Number(id)));
  }, [dispatch, pin, id]);

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

  if (!pin) return <p>Loading...</p>;

  return (
    <div className="pin-detail-container">
      <div className="pin-detail-content">
        {/* Left Column - Pin Information */}
        <div className="pin-info">
          <h1 className="pin-title">{pin.title}</h1>
          <p className="pin-owner">Pin owner: {pin.user?.username || "Unknown"}</p>

          <div className="pin-stats">
            <span className="favorites-count">
              <span className="heart-icon">♥</span> {favoritesCount}
            </span>
          </div>

          <div className="pin-description">
            <p>{pin.description}</p>
          </div>

          {/* {currentUser?.id !== pin.user_id && (
            <OpenModalButton
              buttonText="💬 Add Comment"
              modalComponent={<CommentForm pinId={Number(id)} />}
              className="add-comment-btn"
            />
          )} */}
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
      <CommentList pinId={Number(id)} currentUserId={currentUser?.id} />
    </div>
  );
}
