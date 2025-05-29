const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  lang:String,
  releaseDate: {type: Date},
  genre:String,
  overview: String,
  actors: String,
  photolink:  String,
  vote:Number,
  producers: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Movie", movieSchema);
