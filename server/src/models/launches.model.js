const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploraion X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-1652 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  const newLaunch = {
    ...launch,
    flightNumber: latestFlightNumber,
    customer: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
