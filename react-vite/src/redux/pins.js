// ACTION TYPES
const LOAD_PINS = 'pins/LOAD_PINS';
const CREATE_PIN = 'pins/CREATE_PIN';
const UPDATE_PIN = 'pins/UPDATE_PIN';
const DELETE_PIN = 'pins/DELETE_PIN';
// const FAVORITE_PIN = 'pins/FAVORITE_PIN';
// const UNFAVORITE_PIN = 'pins/UNFAVORITE_PIN';

// ACTION CREATORS
export const loadPins = (pins) => ({
  type: LOAD_PINS,
  pins,
});

export const addPin = (pin) => ({
  type: CREATE_PIN,
  pin,
});

export const updatePin = (pin) => ({
  type: UPDATE_PIN,
  pin,
});

export const removePin = (id) => ({
  type: DELETE_PIN,
  id,
});

// export const favoritePin = (pinId) => ({
//   type: FAVORITE_PIN,
//   pinId,
// });

// export const unfavoritePin = (pinId) => ({
//   type: UNFAVORITE_PIN,
//   pinId,
// });

// Helper to read CSRF cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// THUNK: Fetch all pins
export const fetchPins = () => async (dispatch) => {
  const res = await fetch('/api/pins/');
  if (res.ok) {
    const pins = await res.json();
    dispatch(loadPins(pins));
  } else {
    console.error("Failed to fetch pins");
  }
};

// THUNK: Create a new pin
export const createPin = (data) => async (dispatch) => {
  const res = await fetch('/api/pins/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrf_token'),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const newPin = await res.json();
    dispatch(addPin(newPin));
    return newPin;
  } else {
    console.error("Failed to create pin");
  }
};

// THUNK: Edit an existing pin
export const editPin = (id, data) => async (dispatch) => {
  const res = await fetch(`/api/pins/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrf_token'),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const updatedPin = await res.json();
    dispatch(updatePin(updatedPin));
    return updatedPin;
  } else {
    console.error("Failed to update pin");
  }
};

// THUNK: Delete an existing pin
export const deletePin = (id) => async (dispatch) => {
  const res = await fetch(`/api/pins/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrf_token'),
    },
    credentials: 'include',
  });

  if (res.ok) {
    dispatch(removePin(id));
  } else {
    console.error("Failed to delete pin");
  }
};

// INITIAL STATE
const initialState = {};

// REDUCER
export default function pinsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PINS: {
      const newState = {};
      action.pins.forEach(pin => {
        newState[pin.id] = pin;
      });
      return newState;
    }
    case CREATE_PIN: {
      return {
        ...state,
        [action.pin.id]: action.pin,
      };
    }
    case UPDATE_PIN: {
      return {
        ...state,
        [action.pin.id]: action.pin,
      };
    }
    case DELETE_PIN: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }

    // case FAVORITE_PIN: {
    //   const pin = state[action.pinId];
    //   if (!pin) return state;
    //   return {
    //     ...state,
    //     [action.pinId]: {
    //       ...pin,
    //       isFavorite: true,
    //     },
    //   };
    // }

    // case UNFAVORITE_PIN: {
    //   const pin = state[action.pinId];
    //   if (!pin) return state;
    //   return {
    //     ...state,
    //     [action.pinId]: {
    //       ...pin,
    //       isFavorite: false,
    //     },
    //   };
    // }

    default:
      return state;
  }
}