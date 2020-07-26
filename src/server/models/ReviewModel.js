const mongoose = require("mongoose");

const ReviewModel = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  review: { required: true, type: String },
  rate: { required: true, type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: { type: Number, default: 0 },
});
const Review = mongoose.model("Review", ReviewModel);

module.exports = Review;
