const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const Planet = require("./planets.mongo");

let habitablePlanetsLength = 0;

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (chunk) => {
        if (isHabitablePlanet(chunk)) {
          habitablePlanetsLength++;
          await savePlanet(chunk);
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        console.log(`total ${habitablePlanetsLength} habitable planest found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await Planet.find({}, "keplerName -_id");
}

async function isPlanetExists(planetName) {
  return await Planet.exists({ keplerName: planetName });
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
  isPlanetExists,
};
