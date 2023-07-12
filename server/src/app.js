const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const planetRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();
const pathToPublicFolder = path.join(__dirname, "..", "public");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.static(pathToPublicFolder));
app.use(express.json());
app.use(planetRouter);
app.use(launchesRouter);

app.get("/*", (_, res) => {
  res.sendFile(path.join(pathToPublicFolder, "index.html"));
});

module.exports = app;
