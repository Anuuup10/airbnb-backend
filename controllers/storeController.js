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

exports.postAddToFavourite = (req, res, next) => {
  console.log("Came to add to Favourite", req.body);
  res.redirect("/favourites");
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId, home=>{
    if(!home){
      res.redirect("/homes")
    } else {
      res.render("store/home-detail", {
      home: home,
      pageTitle: "Home Detail",
      currentPage: "home",
    })
    }
  })
};
