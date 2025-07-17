// Action Types - MK
const LOAD_COMMENTS = "comments/LOAD_COMMENTS";
const ADD_COMMENT = "comments/ADD_COMMENT";
const UPDATE_COMMENT = "comments/UPDATE_COMMENT";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

// -------------------------------------
// Action Creators - MK
const loadComments = (comments) => ({
  type: LOAD_COMMENTS,
  comments,
});

const addComment = (comment) => ({
  type: ADD_COMMENT,
  comment,
});

const updateComment = (comment) => ({
  type: UPDATE_COMMENT,
  comment,
});

const removeComment = (commentId) => ({
  type: DELETE_COMMENT,
  commentId,
});

// -------------------------------------
// Thunk Actions (async) - MK
export const fetchCommentsByPin = (pinId) => async (dispatch) => {
  const res = await fetch(`/api/pins/${pinId}/comments`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadComments(data.comments));
  }
};

export const createComment = (pinId, text) => async (dispatch) => {
  const res = await fetch(`/api/pins/${pinId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (res.ok) {
    const comment = await res.json();
    dispatch(addComment(comment));
    return comment;
  }
};

export const editComment = (commentId, text) => async (dispatch) => {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (res.ok) {
    const comment = await res.json();
    dispatch(updateComment(comment));
    return comment;
  }
};

export const deleteComment = (commentId) => async (dispatch) => {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeComment(commentId));
  }
};

// -------------------------------------
// Reducer - MK
const commentsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case LOAD_COMMENTS:
      newState = {};
      action.comments.forEach((comment) => {
        newState[comment.id] = comment;
      });
      return newState;
    case ADD_COMMENT:
      return { ...state, [action.comment.id]: action.comment };
    case UPDATE_COMMENT:
      return { ...state, [action.comment.id]: action.comment };
    case DELETE_COMMENT:
      newState = { ...state };
      delete newState[action.commentId];
      return newState;
    default:
      return state;
  }
};

export default commentsReducer;
