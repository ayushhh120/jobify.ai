const express = require('express');
const app = express()
const dotenv = require('dotenv')
dotenv.config();
const cors = require ('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser');
const passport = require("passport");
require("./config/passport");
const authRoutes = require('./routes/auth.routes');




app.use(cors({
  origin: 'https://jobify-ai-lovat.vercel.app',
  credentials: true
}));


connectDB();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/user', userRoutes)

const session = require("express-session");
app.use(session({
  secret: "some-secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);


const aiRoutes = require('./routes/ai.routes');
app.use('/ai', aiRoutes);





module.exports = app;
