const { getAllLaunches } = require("../../models/launches.model");

function httpGetAllLaunches(_, res) {
  return res.status(200).json(getAllLaunches());
}

module.exports = {
  httpGetAllLaunches,
};
