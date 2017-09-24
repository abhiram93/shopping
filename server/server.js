const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

var User = require('./../models/user.js')
var mainRoutes = require('./../routes/main');
var userRoutes = require('./../routes/user');
var secret = require('./../config/secret');

var app = express();


app.use(express.static(__dirname+ '/../public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:secret.secretKey,
  store: new MongoStore({url:secret.database,autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.engine('ejs', engine);
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;
mongoose.connect(secret.database, { useMongoClient: true } ,function (err) {
  if(err) {
    console.log('Error',err);
  } else {
     console.log('Connected');
  }
});

app.use(mainRoutes);
app.use(userRoutes);




app.listen(secret.port , function (err) {
  console.log('Server Started');
});
