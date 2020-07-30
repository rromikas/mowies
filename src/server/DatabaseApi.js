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
