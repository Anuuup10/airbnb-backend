const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
})

// homeSchema.pre('findOneAndDelete', async function() {
//   const homeId = this.getQuery()["_id"];
//   await favourite.deleteMany({houseId: homeId});
// })

module.exports = mongoose.model('Home', homeSchema);