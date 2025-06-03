const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const UserRoute = require('./routes/UserRoute');
const AdminRoute = require('./routes/AdminRoute');
const HrRoute = require('./routes/Hrroute');
const CompanyRoute = require('./routes/CompanyRoute');
const ApplicationRoute = require('./routes/ApplicationRoute');
const Thought = require('./routes/Thoughts');
const cookieParser = require('cookie-parser');
const cors = require("cors");
dotenv.config();
const bodyParser = require("body-parser");


const app = express();
app.use(fileUpload());
app.use(express.json());



// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

const allowedOrigins = process.env.FRONTEND_URL
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    next();
  }
});

app.options('*', (req, res) => {
  res.sendStatus(204); 
});

app.use(bodyParser.json());

app.use('/', UserRoute);
app.use('/', AdminRoute);
app.use('/', HrRoute);
app.use('/', CompanyRoute);
app.use('/', ApplicationRoute);
app.use('/', Thought);

app.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = app;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
