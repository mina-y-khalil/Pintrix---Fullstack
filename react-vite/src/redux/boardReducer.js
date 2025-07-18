// Import csrfFetch utility for making API requests with CSRF protection
import { csrfFetch } from '../csrf';

// Action Types - Constants that identify different types of actions
const LOAD_BOARDS = 'board/loadBoards';
const LOAD_BOARD = 'board/loadBoard';
const ADD_BOARD = 'board/addBoard';
const UPDATE_BOARD = 'board/updateBoard';
const DELETE_BOARD = 'board/deleteBoard';
const ADD_PIN = 'board/addPin';
const DELETE_PIN = 'board/deletePin';

// Action Creators - Functions that return action objects
export const loadBoards = (boards) => ({
    type: LOAD_BOARDS,
    boards
});

export const loadBoard = (board) => ({
    type: LOAD_BOARD,
    board
});

export const addBoard = (board) => ({
    type: ADD_BOARD,
    board
});

export const updateBoard = (board) => ({
    type: UPDATE_BOARD,
    board
});

export const deleteBoard = (boardId) => ({
    type: DELETE_BOARD,
    boardId
});

export const addPinToBoard = (boardId, pin) => ({
    type: ADD_PIN,
    boardId,
    pin
});

export const deletePinFromBoard = (boardId, pinId) => ({
    type: DELETE_PIN,
    boardId,
    pinId
});

// Thunks - Async action creators that can dispatch multiple actions
// Fetch all boards from the API
export const fetchBoards = () => async (dispatch) => {
    const response = await csrfFetch('/api/boards');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadBoards(data.boards)); 
    }
};

// Fetch a single board by ID
export const fetchBoard = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/boards/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadBoard(data));
    }
};

// Create a new board
export const createBoard = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const board = await response.json();
        dispatch(addBoard(board));
        return board;
    } else {
        const error = await response.json();
        throw error;
    }
};

// Edit an existing board
export const editBoard = (payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/boards/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const board = await response.json();
        dispatch(updateBoard(board));
        return board;
    } else {
        const error = await response.json();
        throw error;
    }
};

// Delete a board
export const removeBoard = (boardId) => async (dispatch) => {
    const res = await csrfFetch(`/api/boards/${boardId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteBoard(boardId));
    }
};

// Add a pin to a board
export const addPin = (boardId, pinId) => async (dispatch) => {
    const res = await csrfFetch(`/api/boards/${boardId}/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin_id: pinId })
    });

    const data = await res.json();

    // Use the returned pin data from the API response
    if (res.ok && !data.message) {
        dispatch(addPinToBoard(boardId, data));
        return data;
    } else if (data.message) {
        return data;
    } else {
        throw data;
    }
};

// Remove a pin from a board
export const deletePin = (boardId, pinId) => async (dispatch) => {
    const res = await csrfFetch(`/api/boards/${boardId}/pins/${pinId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deletePinFromBoard(boardId, pinId));
    }
};

// Initial State - The starting state for the board slice of Redux store
const initialState = { entries: {}, isLoading: true };

// Reducer - Pure function that takes current state and action, returns new state
const boardReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_BOARDS: {
            // Normalize boards by ID for easy access in the store
            const normalizedBoards = {};
            action.boards.forEach(board => {
                normalizedBoards[board.id] = board;
            });
            return { ...state, entries: normalizedBoards, isLoading: false };
        }
        case LOAD_BOARD: {
            // Add or update a single board in the store
            return {
                ...state,
                entries: {
                    ...state.entries,
                    [action.board.id]: action.board
                },
                isLoading: false
            };
        }
        case ADD_BOARD: {
            // Add a new board to the store
            return {
                ...state,
                entries: { ...state.entries, [action.board.id]: action.board }
            };
        }
        case UPDATE_BOARD: {
            // Update an existing board in the store
            return {
                ...state,
                entries: { ...state.entries, [action.board.id]: action.board }
            };
        }
        case DELETE_BOARD: {
            // Remove a board from the store
            const newEntries = { ...state.entries };
            delete newEntries[action.boardId];
            return { ...state, entries: newEntries };
        }
        case ADD_PIN: {
            // Add a pin to a specific board's pins array
            const board = state.entries[action.boardId];
            if (!board) return state;
            
            const updatedBoard = {
                ...board,
                pins: [...(board.pins || []), action.pin] 
            };

            return {
                ...state,
                entries: {
                    ...state.entries,
                    [action.boardId]: updatedBoard
                }
            };
        }
        case DELETE_PIN: {
            // Remove a pin from a specific board's pins array
            const board = state.entries[action.boardId];
            if (!board) return state;

            const updatedBoard = {
                ...board,
                pins: board.pins ? board.pins.filter(pin => pin.id !== action.pinId) : []
            };

            return {
                ...state,
                entries: {
                    ...state.entries,
                    [action.boardId]: updatedBoard
                }
            };
        }
        default:
            // Return current state if action type doesn't match any case
            return state;
    }
};

// Export the reducer as default export
export default boardReducer;