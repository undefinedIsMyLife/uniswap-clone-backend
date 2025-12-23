const express = require("express");
const {createPair , getPairs }= require("../controllers/pair.controller");


const router = express.Router();

//Add a pair
router.post("/", createPair);
//Get all pairs
router.get("/", getPairs);

module.exports = router;