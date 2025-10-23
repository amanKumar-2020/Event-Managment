const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    registrationLink: {
      type: String,
    },
    price: {
      type: String,
      default: "Free",
    },
    contactInfo: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    eventPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eventpartner",
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    
  },
  {
    timestamps: true,
  }
);

const eventModel = mongoose.model("event", eventSchema);

module.exports = eventModel;
