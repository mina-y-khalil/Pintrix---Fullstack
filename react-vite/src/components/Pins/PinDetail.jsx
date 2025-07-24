import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPins, deletePin } from "../../redux/pins";
import { createFavorite, deleteFavorite } from "../../redux/favorites";

export default function PinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pin = useSelector((state) => state.pins[id]);
  const currentUser = useSelector((state) => state.session.user);
  const isFavorited = useSelector((state) => !!state.favorites[id]);
  const comments = useSelector((state) =>
    Object.values(state.comments).filter(
      (comment) => comment.pinId === Number(id)
    )
  );

  useEffect(() => {
    if (!pin) dispatch(fetchPins());
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

  if (!pin) return <p>Loading...</p>;

  return (
    <div className="pin-detail">
      <h2>{pin.title}</h2>
      <img src={pin.imageUrl} alt={pin.title} />
      <p>{pin.description}</p>

      {/*Favorite Toggle */}
      <button onClick={handleFavoriteClick}>
        {isFavorited ? "💔 Unfavorite" : "💖 Favorite"}
      </button>

      {/*Edit &Delete (Only for Owner) */}
      {currentUser?.id === pin.user_id && (
        <>
          <Link to={`/pins/${pin.id}/edit`}>
            <button>Edit This Pin</button>
          </Link>
          <button onClick={handleDelete}>Delete This Pin</button>
        </>
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