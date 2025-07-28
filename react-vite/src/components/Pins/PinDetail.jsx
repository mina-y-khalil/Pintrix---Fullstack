import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fetchPins } from "../../redux/pins";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../redux/favorites";
import { fetchCommentsByPin } from "../../redux/comments";
import { thunkFetchBoards, thunkAddPinToBoard, thunkCreateBoard } from "../../redux/boards";
import "./PinDetail.css";
import OpenModalButton from "../OpenModalButton";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CommentList from "../CommentList";

export default function PinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creatingBoard, setCreatingBoard] = useState(false);

  const pins = useSelector((state) => state?.pins || {});
  let pin = null;
  if (pins && typeof pins === "object") {
    pin = pins[id];
  } else if (Array.isArray(pins)) {
    pin = pins.find((p) => p.id === Number(id));
  }

  const currentUser = useSelector((state) => state?.session?.user);

  const boards = useSelector(state => state.boards.entries);
  const userBoards = Object.values(boards).filter(board => board.user_id === currentUser?.id);


  
  const favorites = useSelector((state) => state.favorites.entries || {});
  const favoritesArray = useMemo(() => Object.values(favorites), [favorites]);


  const isFavorited = useMemo(() => {
    return favoritesArray.some(fav => fav.pin_id === Number(id));
  }, [favoritesArray, id]);

  const favoritesCount = useMemo(() => {
    return favoritesArray.filter(fav => fav.pin_id === Number(id)).length;
  }, [favoritesArray, id]);

  const [showFavoritedPopup, setShowFavoritedPopup] = useState(false);

  useEffect(() => {
    if (!pin) dispatch(fetchPins());
    dispatch(fetchFavorites());
    dispatch(fetchCommentsByPin(Number(id)));
    dispatch(thunkFetchBoards());
  }, [dispatch, pin, id]);

  const handleFavoriteClick = () => {
    if (isFavorited) {
      const favoriteToDelete = favoritesArray.find(fav => fav.pin_id === Number(id));
      if (favoriteToDelete) {
        dispatch(deleteFavorite(favoriteToDelete.id));
      }
    } else {
      dispatch(createFavorite(Number(id))); 
      setShowFavoritedPopup(true);
      setTimeout(() => setShowFavoritedPopup(false), 2000); 
  }
  };

  const handleAddToBoard = async (boardId) => {
  await dispatch(thunkAddPinToBoard(boardId, pin.id));
  setShowDropdown(false);
  navigate(`/boards/${boardId}`);
};

const handleCreateBoard = async () => {
  if (!newBoardName.trim()) return;
  const board = await dispatch(thunkCreateBoard(newBoardName));
  if (board?.id) {
    await dispatch(thunkAddPinToBoard(board.id, pin.id));
    setNewBoardName("");
    setCreatingBoard(false);
    setShowDropdown(false);
    navigate(`/boards/${board.id}`);
  }
};

const handleShare = async () => {
  const pinUrl = `${window.location.origin}/pins/${pin.id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: pin.title,
        text: pin.description || "Check out this pin!",
        url: pinUrl,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(pinUrl);
      alert("Pin link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link.");
    }
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
            <button className="share-btn" onClick={handleShare}>🔗</button>
          </div>

          <div className="action-buttons">
            {currentUser && (
              <>
            <button
              className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
              onClick={handleFavoriteClick}
            >
              {isFavorited ? "Remove from Favorites" : "Add To Favorites"}
            </button>

            {showFavoritedPopup && (
            <div className="favorited-popup">
             Favorited!
            </div>
      )}

{/* Add to board button*/}
            <div className="add-to-board-wrapper">
  <button
    className="add-to-board-btn"
    onClick={() => setShowDropdown(prev => !prev)}
  >
    Add To Board
  </button>

  {showDropdown && (
    <div className="board-dropdown">
      <ul>
        {userBoards.map(board => (
          <li key={board.id}>
            <button onClick={() => handleAddToBoard(board.id)}>
              {board.name}
            </button>
          </li>
        ))}
      </ul>

      {!creatingBoard ? (
        <button onClick={() => setCreatingBoard(true)}>+ Create New Board</button>
      ) : (
        <div className="new-board-form">
          <input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name"
          />
          <button onClick={handleCreateBoard}>Create</button>
        </div>
      )}
    </div>
  )}
</div>
</>
  )}
{ /* END ADD TO BOARD */}

          {/* Edit Button */}
            {currentUser?.id === pin.user_id && (
              <div className="owner-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/pins/${pin.id}/edit`)}
                >
                  Edit This Pin
                </button>

                  {/* Delete Button */}
                  <OpenModalButton
                    buttonText="Delete This Pin"
                    modalComponent={
                      <DeleteConfirmationModal
                        type="pin"
                        pinId={pin.id}
                        navigateAfterDelete={() => navigate("/pins")}
                      />
                    }
                    className="delete-btn"
                  />
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
