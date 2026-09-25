// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const rootDir = require("../utils/pathUtil");

hostRouter.get("/add-home", (req, res, next) => {
  res.render('addHome', {pageTitle: 'Add Home to airbnb', currentPage: 'addHome'});
})

const registeredHomes = [];

hostRouter.post("/add-home", (req, res, next) => {
  console.log('Home Registration successful for:', req.body);
  registeredHomes.push({
    houseName: req.body.houseName,
    price: req.body.price,
    location: req.body.location,
    rating: req.body.rating,
    photoUrl: req.body.photoUrl,
    description: req.body.description
  });
  res.render('homeAdded', {pageTitle: 'Home Added Successfully', currentPage: 'addHome'});
})

exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;
