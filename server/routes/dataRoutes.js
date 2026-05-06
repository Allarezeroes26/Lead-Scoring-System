const express = require("express");
const controller = require("../controllers/lead.controller");

const router = express.Router();

router.post("/lead/predict", controller.predictLead);
router.post("/lead/predict-batch", controller.batchPredictLeads);

module.exports = router