"use strict";

/** Routes for charging station*/

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const Station = require("../models/station");

const newStationSchema = require("../schemas/stationNew.json");
const router = express.Router();
const { getEVChargers } = require("../helpers/openCharger");


/** POST / { search form data} =>  { stations }
 *
 * Search form data { lat, long, charger type, results}
 *
 * Returns { stations }
 *
 */
router.post("/newSearch", async function (req, res, next) {
    try {
        const stations = await getEVChargers(req.body);

        return res.json({ stations });
    } catch (err) {
        return next(err);
    }
});


/**
 * POST / {station} => {station}
 * 
 * Station data  {id, name, address, charger_type, lat, long, supercharger, available}
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


/** GET /station/:id  => {station}
 * 
 *  Station {id, name, address, charger_type, lat, long, supercharger, available} 
 *  
 * Authorization required: logged in user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const stationId = req.params.id;
        const station = await Station.get(stationId);
        return res.json({ station });
    } catch (err) {
        return next(err);
    }
});


/** Delete /station/:id  
 * 
 * Delete station from database.
 * 
 * Authorization required: logged in user
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        await Station.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;