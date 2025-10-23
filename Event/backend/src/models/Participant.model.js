const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Participant = mongoose.model("participant", participantSchema);
module.exports = Participant;
