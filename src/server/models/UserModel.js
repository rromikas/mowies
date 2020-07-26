const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  first_name: String,
  last_name: String,
  display_name: String,
  photo: String,
  whishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  watched: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});
const User = mongoose.model("User", UserModel);

module.exports = User;
