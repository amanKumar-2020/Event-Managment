const userModel = require("../models/user.model")
const eventPartnerModel = require("../models/eventpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {

    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}


async function registereventPartner(req, res) {

    const { name, email, password, phone, address, contactName } = req.body;

    const isAccountAlreadyExists = await eventPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "event partner account already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const eventPartner = await eventPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: eventPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "event partner registered successfully",
        eventPartner: {
            _id: eventPartner._id,
            email: eventPartner.email,
            name: eventPartner.name,
            address: eventPartner.address,
            contactName: eventPartner.contactName,
            phone: eventPartner.phone
        }
    })

}

async function logineventPartner(req, res) {

    const { email, password } = req.body;

    const eventPartner = await eventPartnerModel.findOne({
        email
    })

    if (!eventPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, eventPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: eventPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "event partner logged in successfully",
        eventPartner: {
            _id: eventPartner._id,
            email: eventPartner.email,
            name: eventPartner.name
        }
    })
}

function logouteventPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "event partner logged out successfully"
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registereventPartner,
    logineventPartner,
    logouteventPartner
}