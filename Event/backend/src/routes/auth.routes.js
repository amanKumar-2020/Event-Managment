const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// event partner auth APIs
router.post('/event-partner/register', authController.registereventPartner)
router.post('/event-partner/login', authController.logineventPartner)
router.get('/event-partner/logout', authController.logouteventPartner)



module.exports = router;