// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const eventPartnerRoutes = require('./routes/event-partner.routes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/event-partner', eventPartnerRoutes);

module.exports = app;