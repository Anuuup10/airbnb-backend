const Home = require("../models/home");
const cloudinary = require("../utils/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "airbnb-homes"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findOne({
    _id: homeId,
    owner: req.session.user._id
  })
    .then((home) => {
      if (!home) {
        console.log("Home not found or unauthorized editing attempt.");
        return res.redirect("/host/host-home-list");
      }

      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit your Home",
        currentPage: "host-homes",
        editing: editing,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log("Error while finding home:", err);
      next(err);
    });
};

exports.getHostHomes = (req, res, next) => {
  Home.find({ owner: req.session.user._id })
    .then((registeredHomes) => {
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Host Homes List",
        currentPage: "host-homes",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log("Error while fetching host homes:", err);
      next(err);
    });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const {
      houseName,
      price,
      location,
      rating,
      description
    } = req.body;

    if (!req.file) {
      return res.status(422).send("No image provided");
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      description,
      photo: result.secure_url,
      owner: req.session.user._id
    });

    await home.save();

    console.log("Home saved successfully");

    res.redirect("/host/host-home-list");

  } catch (error) {
    console.log("Error while adding home:", error);
    next(error);
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    const {
      id,
      houseName,
      price,
      location,
      rating,
      description
    } = req.body;

    const home = await Home.findOne({
      _id: id,
      owner: req.session.user._id
    });

    if (!home) {
      console.log("Home not found or unauthorized edit attempt.");
      return res.redirect("/host/host-home-list");
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    // If a new image was selected, upload it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      home.photo = result.secure_url;
    }

    await home.save();

    console.log("Home updated successfully");

    res.redirect("/host/host-home-list");

  } catch (error) {
    console.log("Error while updating home:", error);
    next(error);
  }
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  console.log("Delete request for:", homeId);

  Home.findOneAndDelete({
    _id: homeId,
    owner: req.session.user._id
  })
    .then((deletedHome) => {

      if (!deletedHome) {
        console.log("Unauthorized delete attempt.");
        return res.redirect("/host/host-home-list");
      }

      console.log("Home deleted:", deletedHome._id);

      res.redirect("/host/host-home-list");
    })
    .catch(error => {
      console.log("Error while deleting:", error);
      next(error);
    });
};