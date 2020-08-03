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

export const GetMoviePromotedReviews = (movieId) => {
  return SendPostRequest("/reviews/getPromoted/movie", { movieId });
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

export const GetUser = (userId) => {
  return SendPostRequest("/users/get", { userId });
};

export const GetUserReviews = (reviewIds) => {
  return SendPostRequest("/reviews/get/user", { reviewIds });
};

export const GetUserComments = (commentIds) => {
  return SendPostRequest("/comments/get/user", { commentIds });
};

export const EditUser = (update) => {
  return SendPostRequest("/users/edit", { update });
};

export const GetPopularReviews = (limit) => {
  return SendPostRequest("/reviews/get/popular", { limit });
};

export const GetRecentReviews = (limit) => {
  return SendPostRequest("/reviews/get/recent", { limit });
};

export const GetRecommendations = (limit) => {
  return SendPostRequest("/movies/get/recommended", { limit });
};

export const SearchReviews = (query) => {
  return SendPostRequest("/reviews/search", { query });
};

export const UpdateOrCreateSettings = (settings) => {
  return SendPostRequest("/settings/updateOrCreate", settings);
};

export const GetSettings = () => {
  return SendGetRequest("/settings/get");
};

export const GetUsers = () => {
  return SendGetRequest("/admin/users/get");
};

export const EditUserForAdmin = (update) => {
  return SendPostRequest("/admin/users/edit", update);
};

export const CreateUserForAdmin = (user) => {
  return SendPostRequest("/admin/users/create", user);
};

export const GetReviews = () => {
  return SendGetRequest("/admin/reviews/get");
};

export const GetComments = () => {
  return SendGetRequest("/admin/comments/get");
};

export const EditReviewForAdmin = (review, user) => {
  return SendPostRequest("/admin/reviews/edit", { review, user });
};
export const EditCommentForAdmin = (comment, user) => {
  return SendPostRequest("/admin/comments/edit", { comment, user });
};

export const DeleteMultipleReviews = (ids) => {
  return SendPostRequest("/admin/reviews/delete", ids);
};

export const DeleteMultipleComments = (ids) => {
  return SendPostRequest("/admin/comments/delete", ids);
};

export const EditMultipleUsers = (ids, update) => {
  return SendPostRequest("/admin/users/editMultiple", { ids, update });
};

export const GetAnnouncements = () => {
  return SendGetRequest("/admin/announcements/get");
};

export const CreateAnnouncement = (announcement) => {
  return SendPostRequest("/admin/announcements/create", announcement);
};

export const DeleteMultipleAnnouncements = (ids) => {
  return SendPostRequest("/admin/announcements/delete", ids);
};

export const EditAnnouncement = (announcement) => {
  return SendPostRequest("/admin/announcements/edit", announcement);
};

export const GetActiveAnnouncements = () => {
  return SendGetRequest("/announcements/getActive");
};

export const GetPromotions = () => {
  return SendGetRequest("/admin/promotions/get");
};

export const CreatePromotions = (promotions) => {
  return SendPostRequest("/admin/promotions/create", promotions);
};

export const EditPromotion = (promotion) => {
  return SendPostRequest("/admin/promotions/edit", promotion);
};

export const DeleteMultiplePromotions = (ids, update) => {
  return SendPostRequest("/admin/promotions/delete", { ids, update });
};
