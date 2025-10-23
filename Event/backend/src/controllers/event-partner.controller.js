const eventPartnerModel = require('../models/eventpartner.model');
const eventModel = require('../models/event.model');

async function geteventPartnerById(req, res) {

    const eventPartnerId = req.params.id;

    const eventPartner = await eventPartnerModel.findById(eventPartnerId)
    const eventItemsByeventPartner = await eventModel.find({ eventPartner: eventPartnerId })

    if (!eventPartner) {
        return res.status(404).json({ message: "event partner not found" });
    }

    res.status(200).json({
        message: "event partner retrieved successfully",
        eventPartner: {
            ...eventPartner.toObject(),
            eventItems: eventItemsByeventPartner
        }

    });
}

module.exports = {
    geteventPartnerById
};