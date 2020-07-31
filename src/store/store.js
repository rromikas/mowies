import { createStore, combineReducers } from "redux";

function userReducer(
  state = {
    name: "",
    photo: "",
    token: "",
    email: "",
    ratings: {},
    reviews: [],
    wishlist: [],
    watched: [],
  },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    case "UPDATE_USER":
      return Object.assign({}, state, action.userProperty);
    default:
      return state;
  }
}

function publicUsersReducer(state = {}, action) {
  switch (action.type) {
    case "SET_PUBLICUSERS":
      return action.publicUsers;
    default:
      return state;
  }
}

function ratingsReducer(state = {}, action) {
  switch (action.type) {
    case "SET_RATINGS":
      return action.ratings;
    case "UPDATE_RATINGS":
      return Object.assign({}, state, action.rating);
    default:
      return state;
  }
}

function notificationReducer(
  state = { title: "", message: "", expired: true },
  action
) {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.notification;
    case "UPDATE_NOTIFICATION":
      return Object.assign({}, state, action.notification);
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
  publicUsers: publicUsersReducer,
  ratings: ratingsReducer,
  user: userReducer,
  search: searchReducer,
  notification: notificationReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
