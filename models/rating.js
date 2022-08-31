const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
});

