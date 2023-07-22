const axios = require("axios");

const Launch = require("./launches.mongo");
const { isPlanetExists } = require("./planets.model");

const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, // flight_number
  mission: "Kepler Exploraion X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-1652 b", //not applicable
  customers: ["ZTM", "NASA"], //payloads.customers for each customers
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

function getLaunchDataFromSpaceXLaunch(spaceXLaunch) {
  const {
    flight_number: flightNumber,
    name: mission,
    date_local: launchDate,
    upcoming,
    success,
    rocket: { name: rocket },
    payloads,
  } = spaceXLaunch;
  const customers = payloads.flatMap((payload) => payload.customers);
  return {
    flightNumber,
    mission,
    launchDate,
    upcoming,
    success,
    rocket,
    customers,
  };
}

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,

      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }
  const spaceXLaunchDataArray = response.data.docs;
  spaceXLaunchDataArray.forEach(async (spaceXLaunch) => {
    const launchData = getLaunchDataFromSpaceXLaunch(spaceXLaunch);
    await saveLaunch(launchData);
  });
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (!!firstLaunch) {
    return;
  }
  await populateLaunches();
}

async function findLaunch(filter) {
  return await Launch.exists(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getAllLaunches() {
  return await Launch.find({}, "-_id -__v");
}

async function saveLaunch(launch) {
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
  const hasPlanetExists = await isPlanetExists(launch.target);
  if (!hasPlanetExists) {
    throw new Error("No Matching Planet Found");
  }
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
  loadLaunchData,
};
