const express = require("express");
const router = express.Router();
const Harvest = require("../models/HarvestModel");
const HarvestControler = require("../controllers/HarvestController");

router.get("/",HarvestControler.getHarvestData);
router.post("/",HarvestControler.addHarvest);
router.get("/:id",HarvestControler.getByID);
router.put("/:id",HarvestControler.updateHarvest);
router.delete("/:id",HarvestControler.deleteHarvest);

module.exports = router;