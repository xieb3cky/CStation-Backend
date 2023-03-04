/**Express app for c-station */

// require("dotenv").config();
const express = require('express');
const cors = require("cors");
const { NotFoundError } = require('./expressError');
const { authenticateJWT } = require("./middleware/auth");

const app = express();

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/station");
const reviewRoutes = require("./routes/review");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/station", stationRoutes);
app.use("/review", reviewRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;