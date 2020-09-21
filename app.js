const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport');
const session = require('express-session');
const keys = require('./config/keys');

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL,{ 
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log('MongoDB Connected')).catch((error) => {
    console.log("Mongo url")
    console.log(process.env.MONGODB_URL)
    console.log(error)
  });

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/users.js'));
app.use('/', require('./routes/manuallyCreatedUser.js'));
app.use('/', require('./routes/routines.js'));
app.use('/', require('./routes/guardianship.js'));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));