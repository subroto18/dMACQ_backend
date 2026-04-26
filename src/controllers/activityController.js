const activityModel = require("../models/activityModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// CREATE
const createActivity = asyncHandler(async (req, res, next) => {
  const { tenantId, actorId, type } = req.body;

  if (!tenantId || !actorId || !type) {
    return next(new AppError("Missing required fields", 400));
  }

  const activity = await activityModel.create(req.body);

  const io = req.app.get("io");

  io.emit("activity:new", activity);

  res.status(201).json({
    success: true,
    data: activity,
  });
});

// GET
const getActivities = asyncHandler(async (req, res, next) => {
  const { tenantId, cursor, limit = 20 } = req.query;

  if (!tenantId) {
    return next(new AppError("tenantId is required", 400));
  }

  const query = { tenantId };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const activities = await activityModel
    .find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
    nextCursor:
      activities.length > 0
        ? activities[activities.length - 1].createdAt
        : null,
  });
});

module.exports = {
  createActivity,
  getActivities,
};
