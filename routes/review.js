
"use strict";

/** Routes for reviews*/

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");
const Station = require("../models/station");
const router = express.Router();
const newReviewSchema = require("../schemas/reviewNew.json");



router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newReviewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
    } catch (err) {
        return next(err);
    }
});


/** GET /station/:id  =>
 *   { station: {id, name, address, charger_type, lat, long, supercharger, available} }
 *  
 * Authorization required: logged in user
 */

router.get("/:id", async function (req, res, next) {
    try {
        const reviewId = req.params.id;
        const station = await Review.get(reviewId);
        return res.json({ station });
    } catch (err) {
        return next(err);
    }
});

/** Update last_login_at for user */


router.patch("/:id", async function (req, res, next) {
    try {
        const reviewId = req.params.id;
        const station = await Review.update(reviewId, req.body);
        return res.json({ station });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        await Review.delete(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;

