const mongoose = require("mongoose");

const MovieModel = new mongoose.Schema({
  title: String,
  backdrop_path: String,
  poster_path: String,
  director: String,
  cast: [{ type: String }],
  runtime: Number,
  release_date: String,
  overview: String,
  adult: Boolean,
  imdb_id: String,
  genres: [],
  excellent_rate: { type: Number, default: 0 },
  good_rate: { type: Number, default: 0 },
  ok_rate: { type: Number, default: 0 },
  bad_rate: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
const Movie = mongoose.model("Movie", MovieModel);

module.exports = Movie;
