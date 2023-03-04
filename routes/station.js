"use strict";

/** Routes for charging station*/

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");

//ensure curr user middleware 

const Station = require("../models/station");

const newStationSchema = require("../schemas/stationNew.json");

const router = express.Router();

const { getEVChargers } = require("../helpers/openCharger");


//get request to openchargerAPI when user new search
router.post("/newSearch", async function (req, res, next) {
    try {
        const stations = await getEVChargers(req.body);
        // console.log(req.body)
        return res.json({ stations });
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /station {station} => {station}
 * 
 * Station data should be {id, name, address, charger_type, lat, long, supercharger, available}
 * 
 * Authorization required: logged in/curr user.
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {

        const validator = jsonschema.validate(req.body, newStationSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const station = await Station.save(req.body);
        return res.status(201).json({ station });
    } catch (err) {
        return next(err);
    }
});


/** GET /station/:id  =>
 *   { station: {id, name, address, charger_type, lat, long, supercharger, available} }
 *  
 * Authorization required: logged in user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const stationId = req.params.id;
        const station = await Station.get(stationId);
        console.log(station)
        return res.json({ station });
    } catch (err) {
        return next(err);
    }
});


router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        await Station.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;