import { csrfFetch } from "../csrf";

// Action Types
const LOAD_FAVORITES = 'favorites/LOAD';
const ADD_FAVORITE = 'favorites/ADD';
const REMOVE_FAVORITE = 'favorites/REMOVE';

// Action Creators
const loadFavorites = (favs) => ({
  type: LOAD_FAVORITES,
  payload: favs,
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
  const res = await fetch('/api/favorites/', {
    method: 'GET',
    credentials: 'include', 
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(loadFavorites(data.pins));
  }
};

// POST /api/favorites/
export const createFavorite = (pin_id) => async (dispatch) => {
  const res = await csrfFetch('/api/favorites/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin_id }),
    credentials: 'include'
  });

  if (res.ok) {
    const data = await res.json();
    
    // Check if it's already favorited
    if (data.message === 'Already favorited') {
      // Don't dispatch anything - just return
      console.log('Pin already favorited');
      return { alreadyFavorited: true };
    }
    
    // Only dispatch if it's a new favorite
    dispatch(addFavorite(data));
    return { fav: data };
  }
};

// DELETE /api/favorites/:id
export const deleteFavorite = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/favorites/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (res.ok) {
    dispatch(removeFavorite(id));
  }
};

const initialState = { entries: {}};

// Reducer
const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FAVORITES: {
      const newEntries = {};
      action.payload.forEach((fav) => {
        newEntries[fav.id] = fav;
      });
      return { ...state, entries: newEntries };
    }

    case ADD_FAVORITE:
      return { 
        ...state, 
        entries: { 
          ...state.entries, 
          [action.fav.id]: action.fav 
        } 
      }; 
    

    case REMOVE_FAVORITE: {
      const newEntries = { ...state.entries };
      delete newEntries[action.id];
      return { 
        ...state, 
        entries: newEntries
      };
    }

    default:
      return state;
  }
};

export default favoritesReducer;