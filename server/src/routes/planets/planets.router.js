const planetRouter = require("express").Router();
const { httpGetAllPlanets } = require("./planets.controller");

planetRouter.get("/", httpGetAllPlanets);

module.exports = planetRouter;
