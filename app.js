// DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');
const DB_PATH = "mongodb+srv://anupchaudhary048_db_user:anupmongodb10@airbnb-cluster.jvicaif.mongodb.net/airbnb?appName=airbnb-cluster";

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require('./routes/authRouter');
const rootDir = require("./utils/pathUtil");
const errorsController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for(let i = 0; i < length; i++) {
    result = characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const multerOptions = {
  storage
};

app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, 'public')));

// session
app.use(session({
  secret: 'Learning backend in nodejs',
  resave: false,
  saveUninitialized: true,
  store: store,
}));

// reading cookies
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
})

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
});
app.use("/host", hostRouter);

app.use(errorsController.get404);

const PORT = 3000;


mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("Error while connecting to Mongo", err);
})
