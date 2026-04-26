const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    actorId: {
      type: String,
      required: true,
    },
    actorName: { type: String },
    type: {
      type: String,
      enum: [
        "POST_CREATED",
        "POST_DELETED",
        "POST_LIKED",
        "POST_SHARED",
        "COMMENT_CREATED",
        "COMMENT_DELETED",
        "USER_FOLLOWED",
        "USER_UNFOLLOWED",
        "STORY_POSTED",
      ],
      required: true,
    },
    entityId: { type: String },
    metadata: { type: Object },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
