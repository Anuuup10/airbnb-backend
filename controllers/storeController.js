const Favourite = require("../models/favourite");
const Home = require("../models/home");


exports.getIndex = (req, res, next) => {
  console.log('Session value: ', req.session)
  Home.find().then(registeredHomes => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
    })
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "home",
      isLoggedIn: req.isLoggedIn,
    })
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
  })
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
    .populate('houseId')
    .then(favourites => {
      const favouriteHomes = favourites.map(fav => fav.houseId);
      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn: req.isLoggedIn,
      })
    });
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    const homeId = req.body.id;
    const existingFav = await Favourite.findOne({ houseId: homeId });
    if (!existingFav) {
      const fav = new Favourite({ houseId: homeId });
      await fav.save();
    }
    res.redirect('/favourites');
  } catch (err) {
    console.log('Error while adding to favourites', err);
  }
};


exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home) {
      res.redirect("/homes")
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "home",
        isLoggedIn: req.isLoggedIn,
      })
    }
  })
};

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ houseId: homeId })
    .then(result => {
      console.log('Favourite removed ', result);
    }).catch(err => {
      console.log('Error while removing favourite', err);
    }).finally(() => {
      res.redirect("/favourites");
    })
};

