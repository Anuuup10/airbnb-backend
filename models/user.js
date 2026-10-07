const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is resuired"]
  },
  email: {
    type: String,
    required: [true, "Email is resuired"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is resuired"]
  },
  userType: {
    type: String,
    enum: ['guest', 'host'],
    default: 'guest'
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
});


module.exports = mongoose.model('User', userSchema);