const Home = require("../models/home");


exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) =>
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
    }),
  );
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) =>
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "home",
    }),
  );
};

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
    })
};

exports.getFavouriteList = (req, res, next) => {
    Home.fetchAll((registeredHomes) =>
    res.render("store/favourite-list", {
      registeredHomes: registeredHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
    }),
  );
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log(homeId);
    res.render("store/home-detail", {
      pageTitle: "Home Detail",
      currentPage: "home",
    })
};
