"use strict";

const express = require("express");
const { NotFoundError } = require("../expressError");
const db = require("../db");

/** Related functions for favorites. */

class Favorite {
    /** 
     * Get favorite base on user ID and station ID.
     * 
     * Return favorite.
     * 
     * Throws NotFoundError if not found.
     */

    static async get(user_id, station_id) {

        const favRes = await db.query(
            `SELECT id
            FROM favorites
            WHERE user_id=$1 and station_id=$2`, [user_id, station_id],
        );
        const fave = favRes.rows[0];

        if (!fave) throw new NotFoundError(`No favorite found!`);

        return favRes;
    };


    /** 
     * Add favorites to database passing in user ID and station ID.
     * 
     * Return favorite.
     * 
     */
    static async add(user_id, station_id) {
        const result = await db.query(
            `INSERT INTO favorites (user_id, station_id)
                VALUES ($1,$2)`,
            [user_id, station_id]);
        const newFav = result.rows[0];
        return newFav;
    };

    /** 
   * Delete favorite from database, passing in favorite Id. 
   * 
   * Throws NotFoundError if favorite not found.
   */
    static async delete(fav_id) {

        const result = await db.query(
            `DELETE
                 FROM favorites
                 WHERE id = $1
                 RETURNING id`, [fav_id]);

        const fav = result.rows[0];

        if (!fav) throw new NotFoundError(`No review: ${fav_id}`);
    }
}

module.exports = Favorite;