export const ServerUrl =
  process.env.NODE_ENV === "development"
    ? "http://192.168.1.183:5000"
    : "https://calm-coast-57354.herokuapp.com";
