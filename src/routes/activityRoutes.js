const express = require("express");
const router = express.Router();

const {
  createActivity,
  getActivities,
} = require("../controllers/activityController");

router.post("/activities", createActivity);
router.get("/activities", getActivities);

module.exports = router;
