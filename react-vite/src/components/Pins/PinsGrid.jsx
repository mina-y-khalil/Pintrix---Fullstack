// src/components/Pins/PinsGrid.jsx
import { useSelector } from "react-redux";
import "./PinsGrid.css"; // Optional: for styling

export default function PinsGrid() {
  const pins = useSelector(state => Object.values(state.pins));

  return (
    <div className="pins-grid">
      {pins.length ? (
        pins.map(pin => (
          <div key={pin.id} className="pin-card">
            <h3>{pin.title}</h3>
            <img src={pin.imageUrl} alt={pin.title} />
            <p>{pin.description}</p>
          </div>
        ))
      ) : (
        <p>No pins yet. Let’s get creative!</p>
      )}
    </div>
  );
}