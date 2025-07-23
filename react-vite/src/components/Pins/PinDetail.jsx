// src/components/Pins/PinDetail.jsx
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPins } from "../../redux/pins";

export default function PinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const pin = useSelector(state => state.pins[id]);

  useEffect(() => {
    if (!pin) dispatch(fetchPins()); // load pins if not yet available
  }, [dispatch, pin]);

  if (!pin) return <p>Loading...</p>;

  return (
    <div className="pin-detail">
      <h2>{pin.title}</h2>
      <img src={pin.imageUrl} alt={pin.title} />
      <p>{pin.description}</p>
    </div>
  );
}