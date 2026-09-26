const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};



exports.postAddHome = (req, res, next) => {
  console.log("Home Registration successful for:", req.body);
  const {houseName, price, location, rating, photoUrl, description} = req.body;
  const home = new Home(houseName, price, location, rating, photoUrl, description);
  home.save();
  res.render("homeAdded", {
    pageTitle: "Home Added Successfully",
    currentPage: "addHome",
  });
};

exports.getHomes = (req, res, next) => {
  const registeredHomes = Home.fetchAll();
  console.log(registeredHomes);
  res.render("home", {
    registeredHomes: registeredHomes,
    pageTitle: "airbnb Home",
    currentPage: "home",
  });
};
