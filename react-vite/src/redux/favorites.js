// Action Types
const LOAD_FAVORITES = 'favorites/LOAD';
const ADD_FAVORITE = 'favorites/ADD';
const REMOVE_FAVORITE = 'favorites/REMOVE';

// Action Creators
const loadFavorites = (favs) => ({
  type: LOAD_FAVORITES,
  favs
});

const addFavorite = (fav) => ({
  type: ADD_FAVORITE,
  fav
});

const removeFavorite = (id) => ({
  type: REMOVE_FAVORITE,
  id
});

// Thunks

// GET /api/favorites/
export const fetchFavorites = () => async (dispatch) => {
  const res = await fetch('/api/favorites');
  alert(res.status)
  if (res.ok) {
    const data = await res.json();
    dispatch(loadFavorites(data.pins));
  }
};

// POST /api/favorites/
export const createFavorite = (pin_id) => async (dispatch) => {
  const res = await fetch('/api/favorites/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin_id })
  });

  if (res.ok) {
    const fav = await res.json();
    dispatch(addFavorite(fav));
  }
};

// DELETE /api/favorites/:id
export const deleteFavorite = (id) => async (dispatch) => {
  const res = await fetch(`/api/favorites/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(removeFavorite(id));
  }
};

const initialState = { entries: {}, isLoading: true };

// Reducer
const favoritesReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_FAVORITES: {
      return { ...state, entries: {...state.entries}, enisLoading: false };
    }

    case ADD_FAVORITE:
      return { ...state, [action.fav.id]: action.fav };

    case REMOVE_FAVORITE: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }

    default:
      return state;
  }
};

export default favoritesReducer;
