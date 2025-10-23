const express = require('express');
const eventPartnerController = require("../controllers/event-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


/* /api/event-partner/:id */
router.get("/:id",
    authMiddleware.authUserMiddleware,
    eventPartnerController.geteventPartnerById)

module.exports = router;