const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const sha256 = require('sha256');
const MongoStore = require('connect-mongo')(session);
const User = require('./model/user');

const PORT = 3000;

app.use(session({
  name: app.get('session cookie name'),
  secret: 'whatwhat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

mongoose.connect('mongodb://localhost:27017/solo', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cookieParser());
app.set('view engine', 'hbs');
app.set('session cookie name', 'sid');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/start');
});

app.get('/start', (req, res) => {
  res.render('start');
});

app.get('/registration', (req, res) => {
  res.render('registration');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const userInDB = await User.findOne({ name: req.body.name });
  if (userInDB) {
    if (req.body.name === userInDB.name && sha256(req.body.password) === userInDB.password) {
      req.session.user = userInDB.name;
      res.json({ name: userInDB.name });
    }
  } else {
    res.json({ answer: 'no' });
  }
});

app.post('/registration', async (req, res) => {
  const userInDB = await User.findOne({ name: req.body.name });
  if (userInDB && userInDB.name === req.body.name) {
    res.json({ answer: 'sorry, name has existed yet' });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: sha256(req.body.password),
      age: req.body.age,
    });
    newUser.save();
    req.session.user = req.body.name;
    res.json({ name: newUser.name });
  }
});

app.get('/main', (req, res) => {
  if (req.session.user) {
    res.render('main');
  } else {
    res.redirect('/start');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie(req.app.get('session cookie name'));
  res.redirect('/');
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('started');
});

module.exports = app;
