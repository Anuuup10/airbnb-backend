exports.getAddHome = (req, res, next) => {
  res.render("addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};

const registeredHomes = [];

exports.postAddHome = (req, res, next) => {
  console.log("Home Registration successful for:", req.body);
  registeredHomes.push({
    houseName: req.body.houseName,
    price: req.body.price,
    location: req.body.location,
    rating: req.body.rating,
    photoUrl: req.body.photoUrl,
    description: req.body.description,
  });
  res.render("homeAdded", {
    pageTitle: "Home Added Successfully",
    currentPage: "addHome",
  });
};

exports.getHomes = (req, res, next) => {
  console.log(registeredHomes);
  res.render("home", {
    registeredHomes: registeredHomes,
    pageTitle: "airbnb Home",
    currentPage: "home",
  });
};
