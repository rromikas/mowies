import { createStore, combineReducers } from "redux";

function userReducer(
  state = {
    first_name: "",
    last_name: "",
    display_name: "",
    photo: "",
    token: "",
    email: "",
    ratings: {},
    reviews: [],
    wishlist: [],
    watchedlist: [],
    notifications: [],
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
    case "UPDATE_PUBLICUSERS":
      return Object.assign({}, state, action.publicUser);
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

function navbarHeightReducer(state = 0, action) {
  switch (action.type) {
    case "SET_HEIGHT":
      return action.height;
    default:
      return state;
  }
}

function settingsReducer(
  state = {
    _id: "NonExistingID",
    movies_api_key: "",
    movie_data_api: "",
    latest_movies_api: "",
    no_popular_reviews: 5,
    no_popular_movies: 5,
    no_allowed_reviews: 5,
    no_comment_characters: 400,
    no_review_words: 80,
    bg_image_refresh_time_days: 0,
    bg_image_refresh_time_hours: 0,
    bg_image_refresh_time_minutes: 0,
  },
  action
) {
  switch (action.type) {
    case "SET_SETTINGS":
      return action.settings;
    case "UPDATE_SETTINGS":
      return Object.assign({}, state, action.settings);
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
  settings: settingsReducer,
  navbarHeight: navbarHeightReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
