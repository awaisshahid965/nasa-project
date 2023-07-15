const Launch = require("./launches.mongo");
const { isPlanetExists } = require("./planets.model");

const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploraion X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-1652 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await Launch.exists({ flightNumber: launchId });
}

async function getAllLaunches() {
  return await Launch.find({}, "-_id -__v");
}

async function saveLaunch(launch) {
  const hasPlanetExists = await isPlanetExists(launch.target);
  if (!hasPlanetExists) {
    throw new Error("No Matching Planet Found");
  }
  return await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort("-flightNumber");
  return latestLaunch?.flightNumber ?? DEFAULT_FLIGHT_NUMBER;
}

async function seheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);

  return newLaunch;
}

async function abortLaunchById(launchId) {
  const aborted = await Launch.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  seheduleNewLaunch,
  abortLaunchById,
};
