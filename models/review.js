"use strict";


const express = require("express");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const db = require("../db");


/** Related functions for reviews. */

class Review {
    /** Create a review (from data), update db, return new review data.
     *
     * data should be { user_id, station_id, review, rating, r_date, r_time }
     *
     * Returns { id, user_id, station_id, review, rating, r_date, r_time }
     **/

    static async create(data) {

        const { user_id, station_id, title, review, rating, r_time } = data;


        const result = await db.query(
            `INSERT INTO reviews 
                (user_id, 
                station_id, 
                title, 
                review, 
                rating, 
                r_time )
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING user_id, station_id, title, review, rating, r_time `,
            [
                user_id,
                station_id,
                title,
                review,
                rating,
                r_time
            ]);

        let userReview = result.rows[0];
        return userReview;
    }

    //find all reviews on a station
    static async findAll(stationId) {
        const result = await db.query(
            `SELECT station_id, 
                review, 
                rating, 
                r_date,
                r_time
                FROM reviews r
                LEFT JOIN stations s
                ON s_id = $1`, [stationId]);

        const reviews = result.rows[0];
        return reviews;
    }

    /** Given a review id, return data about review.
   *
   * Returns { user_id, station_id, review, rating, r_date, r_time }
   *   where station is { handle, name, description, numEmployees, logoUrl }
   *
   * Throws NotFoundError if not found.
   **/
    static async find(id) {
        const reviewRes = await db.query(
            `SELECT user_id, 
            station_id, 
            review, 
            rating, 
            r_date, 
            r_time
            FROM reviews
            WHERE id=$1`, [id]);
        const userReview = reviewRes.rows[0];
        if (!userReview) throw new NotFoundError(`No review: ${id}`);

    }

    static async get(reviewId) {
        const reviewRes = await db.query(
            `SELECT user_id, 
            station_id, 
            title,
            review, 
            rating, 
            r_time
            FROM reviews
            WHERE id=$1`, [reviewId]);
        const review = reviewRes.rows[0];
        if (!review) throw new NotFoundError(`No review: ${id}`);
        return review;
    }


    //   static async updateLoginTimestamp(username) {
    //     const result = await db.query(
    //         `UPDATE users 
    //       SET last_login_at = current_timestamp
    //     WHERE username=$1
    //     RETURNING username`,
    //         [username]);
    //     if (!result.rows[0]) {
    //         throw new ExpressError(`No user: ${username}`, 404);
    //     }
    // }

    static async update(reviewId, data) {
        const { title, review, rating, r_time } = data;
        const result = await db.query(
            `UPDATE reviews SET review=$1, rating=$2, r_time=$3, title = $5
             WHERE id = $4
             RETURNING id, title, review, rating, r_time`,
            [review, rating, r_time, reviewId, title]
        );
        const reviewUpdate = result.rows[0];

        if (!reviewUpdate) throw new NotFoundError(`No review: ${reviewId}`);

        return reviewUpdate;
    };


    static async delete(id) {
        const result = await db.query(
            `DELETE
                 FROM reviews
                 WHERE id = $1
                 RETURNING id`, [id]);
        const review = result.rows[0];

        if (!review) throw new NotFoundError(`No review: ${id}`);
    }
}
module.exports = Review;


