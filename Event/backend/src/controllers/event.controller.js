const eventModel = require('../models/event.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createevent(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const eventItem = await eventModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        eventPartner: req.eventPartner._id
    })

    res.status(201).json({
        message: "event created successfully",
        event: eventItem
    })

}

async function geteventItems(req, res) {
    const eventItems = await eventModel.find({})
    res.status(200).json({
        message: "event items fetched successfully",
        eventItems
    })
}


async function likeevent(req, res) {
    const { eventId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        event: eventId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            event: eventId
        })

        await eventModel.findByIdAndUpdate(eventId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "event unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        event: eventId
    })

    await eventModel.findByIdAndUpdate(eventId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "event liked successfully",
        like
    })

}

async function saveevent(req, res) {

    const { eventId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        event: eventId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            event: eventId
        })

        await eventModel.findByIdAndUpdate(eventId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "event unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        event: eventId
    })

    await eventModel.findByIdAndUpdate(eventId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "event saved successfully",
        save
    })

}

async function getSaveevent(req, res) {

    const user = req.user;

    const savedevents = await saveModel.find({ user: user._id }).populate('event');

    if (!savedevents || savedevents.length === 0) {
        return res.status(404).json({ message: "No saved events found" });
    }

    res.status(200).json({
        message: "Saved events retrieved successfully",
        savedevents
    });

}


module.exports = {
    createevent,
    geteventItems,
    likeevent,
    saveevent,
    getSaveevent
}