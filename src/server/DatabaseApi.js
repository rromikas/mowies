const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://calm-coast-57354.herokuapp.com";

const SendPostRequest = (path, data) => {
  return fetch(`${origin}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

const SendGetRequest = (path) => {
  return fetch(`${origin}${path}`).then((res) => res.json());
};

export const FindOrCreateMovie = (movie) => {
  return SendPostRequest("/movie/findOrCreate", movie);
};

export const Signup = (user) => {
  return SendPostRequest("/user/signup", user);
};

export const Login = (credentials) => {
  return SendPostRequest("/user/login", credentials);
};

export const LoginWithToken = (token) => {
  console.log("TOKEN ASDNA", token);
  return SendPostRequest("/user/loginWithToken", token);
};

export const GetAllRatings = () => {
  return SendGetRequest("/ratings/get/all");
};

export const GetAllPublicUsers = () => {
  return SendGetRequest("/publicUsers/get/all");
};

export const RateMovie = (rate, movie, user) => {
  return SendPostRequest("/ratings/update", { rate, movie, user });
};

export const WriteReview = (review, movie, user) => {
  return SendPostRequest("/reviews/update", { review, movie, user });
};

export const GetMovieReviews = (movieId) => {
  return SendPostRequest("/reviews/get/movie", { movieId });
};

export const WriteComment = (comment, user) => {
  return SendPostRequest("/comments/update", { user, comment });
};

export const GetReviewComments = (reviewId) => {
  return SendPostRequest("/comments/get/review", { reviewId });
};

export const AddToWishList = (user, movie) => {
  return SendPostRequest("/movie/addToWishlist", { user, movie });
};

export const RemoveFromWishList = (user, movieId) => {
  return SendPostRequest("/movie/removeFromWishlist", { user, movieId });
};

export const AddViewToMovie = (movie) => {
  return SendPostRequest("/movie/views/add", { movie });
};

export const LikeReview = (user, reviewId) => {
  return SendPostRequest("/reviews/like", { user, reviewId });
};

export const LikeComment = (user, commentId) => {
  return SendPostRequest("/comments/like", { user, commentId });
};

export const ReportReview = (user, reviewId) => {
  return SendPostRequest("/reviews/report", { user, reviewId });
};

export const ReportComment = (user, commentId) => {
  return SendPostRequest("/comments/report", { user, commentId });
};
