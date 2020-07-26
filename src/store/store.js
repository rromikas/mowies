import { createStore, combineReducers } from "redux";

function userReducer(
  state = {
    name: "Sabrina",
    photo:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    default:
      return state;
  }
}

function searchReducer(state = { query: "", category: "Movies" }, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return action.search;
    case "UPDATE_SEARCH":
      return Object.assign({}, state, action.search);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
