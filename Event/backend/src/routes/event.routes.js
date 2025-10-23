const express = require('express');
const eventController = require("../controllers/event.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/event/ [protected]*/
router.post('/',
    authMiddleware.autheventPartnerMiddleware,
    upload.single("mama"),
    eventController.createevent)


/* GET /api/event/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    eventController.geteventItems)


router.post('/like',
    authMiddleware.authUserMiddleware,
    eventController.likeevent)


router.post('/save',
    authMiddleware.authUserMiddleware,
    eventController.saveevent
)


router.get('/save',
    authMiddleware.authUserMiddleware,
    eventController.getSaveevent
)



module.exports = router