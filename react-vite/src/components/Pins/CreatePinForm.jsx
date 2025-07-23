// src/components/Pins/CreatePinForm.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPin } from "../../redux/pins";
// import "./CreatePinForm.css"; 

export default function CreatePinForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!title.trim()) validationErrors.push("Title is required.");
    if (!imageUrl.trim()) validationErrors.push("Image URL is required.");
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    const newPin = await dispatch(createPin({ title, imageUrl, description }));
    if (newPin) {
      setTitle("");
      setImageUrl("");
      setDescription("");
      navigate("/pins");
    }
  };

  return (
    <form className="create-pin-form" onSubmit={handleSubmit}>
      <h2>📌 Create a New Pin</h2>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a pin title"
      />

      <label htmlFor="imageUrl">Image URL:</label>
      <input
        id="imageUrl"
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://..."
      />

      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional details..."
      />

      <button type="submit">Save Pin</button>
    </form>
  );
}