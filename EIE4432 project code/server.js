//Student name: Yuen Pak Hei
//Student ID: 23079398d
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 8080;

mongoose.connect('mongodb+srv://23079398d:J1xt5MFMamYxb5RF@3112nosql.pkhakve.mongodb.net/?appName=3112NoSQL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'orchestra_secret_here',
  resave: false,
  saveUninitialized: false,
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const authRouter = require('./routes/auth');
const eventsRouter = require('./routes/events')(upload);
const seatsRouter = require('./routes/seats');
const bookingsRouter = require('./routes/bookings');
const adminRouter = require('./routes/admin');

app.use('/auth', authRouter(upload));
app.use('/events', eventsRouter);
app.use('/seats', seatsRouter);
app.use('/bookings', bookingsRouter);
app.use('/admin', adminRouter);

app.get('/auth/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('../public/index.html');
  } else {
    res.redirect('../public/login.html');
  }
});

function printStartInfo() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const hkt = new Date(utc + 8*3600000);
  console.log(`Server started at http://127.0.0.1:${PORT}`);
  console.log(`Current date/time (HKT): ${hkt.toLocaleString()}`);
}

app.listen(PORT, printStartInfo);
