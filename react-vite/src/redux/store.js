import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import commentsReducer from "./comments";
import boardsReducer from "./boards";
import pinsReducer from "./pins";
import favoritesReducer from "./favorites"; 



const rootReducer = combineReducers({
  session: sessionReducer,
  comments: commentsReducer,
  boards: boardsReducer,
  pins: pinsReducer,
  favorites: favoritesReducer, 

});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;