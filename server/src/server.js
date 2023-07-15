const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT ?? 8000;

const server = http.createServer(app);

const MONGO_URL =
  "mongodb+srv://awais:11223344@nasaproject.y5tw7av.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection failed!");
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
}

startServer();
