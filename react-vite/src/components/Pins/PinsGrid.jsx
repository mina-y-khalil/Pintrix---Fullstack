import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPins } from "../../redux/pins";

export default function PinsGrid() {
  const dispatch = useDispatch();
  const pins = useSelector(state => Object.values(state.pins));

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

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