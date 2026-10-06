const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {email: ""}
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exists"],
      oldInput: { email },
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: { email },
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      name: "",
      email: "",
      password: "",
      userType: "",
    },
  });
};

exports.postSignup = [
  // Name validation
  check("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be atleast two characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contain only alphabets"),

  // Email validation
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  // Password validation
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Pasword must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Pasword must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Pasword must contain at least one number")
    .matches(/[!@#$%^&*,.?:{}<>]/)
    .withMessage("Pasword must contain at least one special character")
    .trim(),

  // Confirm password validation
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  //UserType validation
  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  // Terms validation
  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value != "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),
  (req, res, next) => {
    const { name, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          name,
          email,
          password,
          userType,
        },
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [err.message],
          oldInput: {
            name,
            email,
            password,
            userType,
          },
        });
      });
  },
];

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
