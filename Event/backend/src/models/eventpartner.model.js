const mongoose = require('mongoose');

const eventPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const eventPartnerModel = mongoose.model("eventpartner", eventPartnerSchema);

module.exports = eventPartnerModel;