const mongoose = require("mongoose");

const CommentModel = new mongoose.Schema({
  comment: { required: true, type: String },
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Comment = mongoose.model("Comment", CommentModel);

module.exports = Comment;
