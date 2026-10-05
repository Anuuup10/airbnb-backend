const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Host Homes List",
        currentPage: "host-homes",
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch(err => {
      console.log("Error while fetching host homes", err);
      next(err);
    });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId)
    .then(home => {
      if (!home) {
        console.log("Home not found");
        return res.redirect("/host/host-home-list");
      }
      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit your home",
        currentPage: "host-homes",
        editing: editing,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch(err => {
      console.log("Error while fetching home for editing", err);
      res.redirect("/host/host-home-list");
    });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl, description } =
    req.body;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photoUrl,
    description,
  });
  home.save()
    .then(() => {
      console.log('Home saved successfully');
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.log("Error while saving home", err);
      res.redirect("/host/add-home");
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl, description } =
    req.body;
  Home.findById(id)
    .then((home) => {
      if (!home) {
        return res.redirect("/host/host-home-list");
      }
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.photoUrl = photoUrl;
      home.description = description;
      return home.save().then(() => {
        console.log('Home updated successfully');
        res.redirect("/host/host-home-list");
      });
    })
    .catch(err => {
      console.log('Error while finding or updating home', err);
      res.redirect("/host/host-home-list");
    });  
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to Delete", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting", error);
      res.redirect("/host/host-home-list");
    });
};
