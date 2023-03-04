"use strict";

/** Routes for user. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const db = require("../db");
const User = require("../models/user");
const Favorite = require("../models/favorites");
const Station = require("../models/station");
const { createToken } = require("../helpers/tokens");

const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();



/** GET /user/:[username] => { user }
 *
 * Returns { username, firstName, lastName, bio, profile_img, cover_img }
 * 
 * Authorization required: same user-as-:username
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {

        const username = req.params.username;
        const user = await User.get(username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});



/** PATCH /user/:id { user } => { user }
 *
 * Data can include:
 *   { username, firstName, lastName, password, email, bio, profile_img, cover_img }
 *
 * Returns { username, firstName, lastName, password, email, bio, profile_img, cover_img }
 *
 * Authorization required:  same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const username = req.params.username;
        const user = await User.update(username, req.body)
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});



/** POST /[username]/favorites/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: same-user-as-:username
 * */

router.post("/favorites", ensureCorrectUser, async function (req, res, next) {
    try {
        //save the station
        await Station.save(req.body);
        const { user_id, id } = req.body;
        //adds the favorite
        await Favorite.add(user_id, id);
        return res.json("hello");
    } catch (err) {
        return next(err);
    }
});

router.post("/delete-favorite", ensureCorrectUser, async function (req, res, next) {
    try {
        //get station id
        const { user_id, station_id } = req.body
        let sid = await Favorite.get(user_id, station_id);
        let to_delete = sid.rows[0].id
        await Favorite.delete(to_delete)
        return res.json("hello");
    } catch (err) {
        return next(err);
    }
});

module.exports = router;