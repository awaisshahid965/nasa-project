const mongoose = require("mongoose");

// Define the schema
const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

const Planet = mongoose.model("Planet", planetSchema);

module.exports = Planet;
