// src/components/Pins/EditPinForm.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPin, fetchPins } from "../../redux/pins";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPinForm.css";


export default function EditPinForm() {
  const { id } = useParams();
  const pin = useSelector(state => state.pins[id]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!pin) {
      dispatch(fetchPins()); // Just in case pins weren't loaded yet
    } else {
      setTitle(pin.title);
      setDescription(pin.description);
    }
  }, [dispatch, pin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description };
    const updated = await dispatch(editPin(id, data));
    if (updated) navigate("/pins");
  };

  if (!pin) return <p>Loading pin data...</p>;

  return (
    <form onSubmit={handleSubmit} className="edit-pin-form">
      {/* Pin Image Display */}
      <div className="pin-image-display">
        <img src={pin.image_url} alt={pin.title} />
      </div>

      <h2>Edit Pin</h2>

      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} />

      <button type="submit">Save Changes</button>
    </form>
  );
}