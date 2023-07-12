const planetRouter = require("express").Router();
const { httpGetAllPlanets } = require("./planets.controller");

planetRouter.get("/planets", httpGetAllPlanets);

module.exports = planetRouter;
