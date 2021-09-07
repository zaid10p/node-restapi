const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./grapghql/schemas");
const grapgqlResolver = require("./grapghql/resolvers");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

//graphl
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: grapgqlResolver,
    graphiql: true,
  })
);

//error handling middle ware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data || null;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Database connected");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
