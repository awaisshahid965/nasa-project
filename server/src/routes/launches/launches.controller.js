const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(_, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (launch.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  const newlyCreatedLaunch = addNewLaunch(launch);

  return res.status(201).json(newlyCreatedLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
