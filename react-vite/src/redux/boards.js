import { csrfFetch } from '../csrf';

// Action Types
const LOAD_BOARDS = 'board/loadBoards';
const LOAD_BOARD = 'board/loadBoard';
const ADD_BOARD = 'board/addBoard';
const UPDATE_BOARD = 'board/updateBoard';
const DELETE_BOARD = 'board/deleteBoard';
const ADD_PIN = 'board/addPin';
const DELETE_PIN = 'board/deletePin';

// Action Creators
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

// THUNKS

// Fetch all boards from the API
export const fetchBoards = () => async (dispatch, getState) => {
    const response = await csrfFetch('/api/boards');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadBoards(data.boards)); 
        return data.boards
    }

    if (response.status === 401){
        dispatch(loadBoards([]));
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


const initialState = { entries: {}, isLoading: true };

// REDUCERS
const boardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_BOARDS: {
            const normalizedBoards = {};
            action.boards.forEach(board => {
                normalizedBoards[board.id] = board;
            });
            return { ...state, entries: normalizedBoards, isLoading: false };
        }
        case LOAD_BOARD: {
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
            return {
                ...state,
                entries: { ...state.entries, [action.board.id]: action.board }
            };
        }
        case UPDATE_BOARD: {
            return {
                ...state,
                entries: { ...state.entries, [action.board.id]: action.board }
            };
        }
        case DELETE_BOARD: {
            const newEntries = { ...state.entries };
            delete newEntries[action.boardId];
            return { ...state, entries: newEntries };
        }
        case ADD_PIN: {
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
            return state;
    }
};

export default boardsReducer;