import { csrfFetch } from "../csrf";

// Action Types
const LOAD_BOARDS = 'boards/loadBoards';
const ADD_BOARD = 'boards/addBoard';
const UPDATE_BOARD = 'boards/updateBoard';
const DELETE_BOARD = 'boards/deleteBoard';
const ADD_PIN = 'boards/addPin';
const REMOVE_PIN = 'boards/removePin';

// Action Creators
const loadBoards = (boards) => ({
  type: LOAD_BOARDS,
  payload: boards,
});

const addBoard = (board) => ({
  type: ADD_BOARD,
  payload: board,
});

const updateBoard = (board) => ({
  type: UPDATE_BOARD,
  payload: board,
});

const deleteBoard = (boardId) => ({
  type: DELETE_BOARD,
  payload: boardId,
});

const addPin = (boardId, pin) => ({
  type: ADD_PIN,
  payload: { boardId, pin },
});

const removePin = (boardId, pinId) => ({
  type: REMOVE_PIN,
  payload: { boardId, pinId },
});



// THUNKS

// Get all boards for current user
export const thunkFetchBoards = () => async (dispatch) => {
  const res = await fetch('/api/boards/', {
    method: 'GET',
    credentials: 'include', 
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(loadBoards(data.boards));
  }
};

// Fetch a single board with its pins
export const thunkFetchBoard = (boardId) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.ok) {
    const board = await res.json();
    dispatch(addBoard(board)); // Add/replace this board in entries
    return board;
  } else {
    const error = await res.json();
    return error;
  }
};

// Create a new board
export const thunkCreateBoard = (name) => async (dispatch) => {
  const res = await csrfFetch('/api/boards/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });

  if (res.ok) {
    const board = await res.json();
    dispatch(addBoard(board));
    return board;
  } else {
    const error = await res.json();
    return error;
  }
};

// Update board name
export const thunkUpdateBoard = (boardId, updatedFields) => async (dispatch) => {
  const res = await csrfFetch(`/api/boards/${boardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updatedFields),
  });

  if (res.ok) {
    const board = await res.json();
    dispatch(updateBoard(board));
    return board;
  } else {
    const error = await res.json();
    return error;
  }
};

// Delete board
export const thunkDeleteBoard = (boardId) => async (dispatch) => {
  const res = await csrfFetch(`/api/boards/${boardId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.ok) {
    dispatch(deleteBoard(boardId));
  }
};

// Add pin to board
export const thunkAddPinToBoard = (boardId, pinId) => async (dispatch) => {
  const res = await csrfFetch(`/api/boards/${boardId}/pins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ pin_id: pinId }),
  });

  if (res.ok) {
    const pin = await res.json();
    dispatch(addPin(boardId, pin));
    return pin;
  } else {
    const error = await res.json();
    return error;
  }
};

// Remove pin from board
export const thunkRemovePinFromBoard = (boardId, pinId) => async (dispatch) => {
  const res = await csrfFetch(`/api/boards/${boardId}/pins/${pinId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.ok) {
    dispatch(removePin(boardId, pinId));
  }
};



// Initial State
const initialState = {
  entries: {}, 
};

// Reducer
function boardsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BOARDS: {
      const newEntries = {};
      action.payload.forEach((board) => {
        newEntries[board.id] = board;
      });
      return { ...state, entries: newEntries };
    }

    case ADD_BOARD:
      return {
        ...state,
        entries: { ...state.entries, [action.payload.id]: action.payload },
      };

    case UPDATE_BOARD:
      return {
        ...state,
        entries: { ...state.entries, [action.payload.id]: action.payload },
      };

    case DELETE_BOARD: {
      const newEntries = { ...state.entries };
      delete newEntries[action.payload];
      return { ...state, entries: newEntries };
    }

    case ADD_PIN: {
      const { boardId, pin } = action.payload;
      const updatedBoard = {
        ...state.entries[boardId],
        pins: [...state.entries[boardId].pins, pin],
      };
      return {
        ...state,
        entries: { ...state.entries, [boardId]: updatedBoard },
      };
    }

    case REMOVE_PIN: {
      const { boardId, pinId } = action.payload;
      const updatedBoard = {
        ...state.entries[boardId],
        pins: state.entries[boardId].pins.filter((pin) => pin.id !== pinId),
      };
      return {
        ...state,
        entries: { ...state.entries, [boardId]: updatedBoard },
      };
    }

    default:
      return state;
  }
}

export default boardsReducer;