// External Module
const express = require('express');
const userRouter = express.Router();

// Local Module
const storeController = require('../controllers/storeController');

userRouter.get("/", storeController.getIndex);
userRouter.get("/homes", storeController.getHomes);
userRouter.get("/bookings", storeController.getBookings);
userRouter.get("/favourites", storeController.getFavouriteList);
userRouter.get("/homes/:homeId", storeController.getHomeDetails);

module.exports = userRouter;