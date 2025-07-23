import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPin } from "../../redux/pins";

export default function CreatePinForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPin({ title, imageUrl, description }));
    setTitle(""); setImageUrl(""); setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Pin</h2>
      <label>Title:</label>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <label>Image URL:</label>
      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <label>Description:</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">📌 Save Pin</button>
    </form>
  );
}