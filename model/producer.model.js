const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema({
  name: String,
  gender:{
    type: String,
    enum: ["Male", "Female", "Other"]},
  dob: {type: Date},
  bio: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Producer", producerSchema);
