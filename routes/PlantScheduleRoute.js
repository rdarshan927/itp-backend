const express = require('express');
const router = express.Router();
const plantSchedule = require("../models/PlantScheduleModel");
const PlantScheduleController = require("../controllers/plantScheduleController");
const floweringDurations = require('../models/FlowerData'); 

router.get("/", PlantScheduleController.getAllPlantSchedules);
router.post("/", PlantScheduleController.addPlantSchedules);
router.get("/:id", PlantScheduleController.getById);
router.put("/:id", PlantScheduleController.updatePlantSchedule);
router.delete("/:id", PlantScheduleController.deletePlantSchedule);
router.get('/search', PlantScheduleController.searchPlantSchedules);
router.get('/plants/suggestions', (req, res) => {
    const searchTerm = req.query.q || '';
    const suggestions = Object.keys(floweringDurations).filter(plant =>
        plant.toLowerCase().includes(searchTerm.toLowerCase())
    );
    res.json(suggestions);
});



module.exports = router;