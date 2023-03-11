"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Station = require("../models/station");
const Favorites = require("../models/favorites");
const { createToken } = require("../helpers/tokens");

const favoritesId = [];

/**
 * Common setup tasks for all tests.
 * 
 * Delete all users and stations data. 
 * 
 * Creates two test users and two stations, register test user, one who favorites a station. 
 */
async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM stations");

    await Station.save(
        {
            id: 123,
            name: "JFK Supercharger",
            address: "123 Address JFK Queens NY, NY",
            lat: "40.641312",
            long: "-73.778137",
            charger_type: "27",
            phone: "123-456-789",
            email: "JFKcharger@email.com",
            available: 10,
        });
    await Station.save(
        {
            id: 456,
            name: "Laguardia Airport",
            address: "456 Address Laguardia Queens NY, NY",
            lat: "40.776928",
            long: "-73.873962",
            charger_type: "2",
            phone: "456-789-9101",
            email: "Laguardiacharger@email.com",
            available: 5,
        });

    await User.register({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        password: "password1",
    });

    await User.register({
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "user2@user.com",
        password: "password2",
    });
    await User.applyToJob("u1", testJobIds[0]);

    //add station to user's favorites
    favoritesId[0] = (await Favorites.add(1, 456))
    favoritesId[1] = (await Favorites.add(1, 123))
    favoritesId[2] = (await Favorites.add(2, 123))
}

/**
 * Common teardown tasks for each test. 
 * 
 * Function begins a database transction to isolate each test from others and prevent data conflicts.
 */
async function commonBeforeEach() {
    await db.query("BEGIN");
}

/**
 * Common teardown tasks for each tests. 
 * 
 * Function rolls back the database transaction started by 'commonBeforeEach()' to undo any changes made during the tests. 
 */
async function commonAfterEach() {
    await db.query("ROLLBACK");
}

/**
 * Common teardown tasks for each tests. 
 * 
 * Function that peforms common teardown tasks for all tests. 
 * 
 * Ends database connection.
 */
async function commonAfterAll() {
    await db.end();
}


/**
 * Generate authentication tokens for test users, used to authenticate API requests during tests.
 */

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    favoritesId,
};
