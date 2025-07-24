import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";

// Import reducers
import sessionReducer from "./session";
import commentsReducer from "./comments";
<<<<<<< HEAD
import boardReducer from "./boardReducer";
import favoritesReducer from "./favorites"; // ✅ Added this line
=======
import boardsReducer from "./boards";
import pinsReducer from "./pins";

>>>>>>> dev

// Combine reducers
const rootReducer = combineReducers({
  session: sessionReducer,
  comments: commentsReducer,
<<<<<<< HEAD
  board: boardReducer,
  favorites: favoritesReducer, // ✅ Added this line
=======
  boards: boardsReducer,
  pins: pinsReducer,
>>>>>>> dev
});

// Middleware & DevTools setup
let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Create the store
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;