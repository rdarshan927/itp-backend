const express = require('express');
const router = express.Router();
const plantSchedule = require("../models/PlantScheduleModel");
const PlantScheduleController = require("../controllers/plantScheduleController");

router.get("/", PlantScheduleController.getAllPlantSchedules);
router.post("/", PlantScheduleController.addPlantSchedules);
router.get("/:id", PlantScheduleController.getById);
router.put("/:id", PlantScheduleController.updatePlantSchedule);
router.delete("/:id", PlantScheduleController.deletePlantSchedule);
router.get('/search', PlantScheduleController.searchPlantSchedules);

module.exports = router;