const db = require("../db");

const { NotFoundError } = require("../expressError");

/**
 * Related functions for station.
 */

class Station {

    /**Save a charging station data to database, return station. 
     * 
     * Data : {id, name, address, charger_type, lat, long, supercharger, available}
     * 
     * Checks for duplicated station.
     * 
     * 
   * */

    static async save(data) {
        const { id, name, address, lat, long, charger_type, phone, email, available } = data;

        const duplicateCheck = await db.query(
            `SELECT id
                 FROM stations
                 WHERE id = $1`,
            [id],
        );

        if (duplicateCheck.rows[0]) {
            return;
        }

        const result = await db.query(
            `INSERT INTO stations
             (  id, 
                name, 
                address, 
                lat, 
                long, 
                charger_type, 
                phone, 
                email, 
                available
               )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, name, address, lat, long, charger_type, phone, email, available`,
            [
                id,
                name,
                address,
                lat,
                long,
                charger_type,
                phone,
                email,
                available
            ],
        );
        const station = result.rows[0];
        return station;
    }


    /** Given a station ID , return data about the charging station.
     *
     * Returns station data : { id, name, address, charger_type, lat, long, supercharger, available }
     *
     * Throws NotFoundError if station not found.
     **/
    static async get(id) {

        const stationRes = await db.query(
            `SELECT *
            FROM stations
            WHERE id=$1`, [id]);

        const station = stationRes.rows[0];

        if (!station) throw new NotFoundError("No station found");

        /**Get all reviews on the station */
        // const reviewsRes = await db.query(
        //     `SELECT id, 
        //     review,
        //     rating,
        //     r_time
        //     FROM reviews 
        //     WHERE station_id =$1`,
        //     [id]);

        // station.reviews = reviewsRes.rows;

        return station;
    }


    /** Delete given station from database; returns undefined. 
     * 
     * Throws NotFoundError if station not found.
    */

    static async remove(id) {
        let result = await db.query(
            `DELETE
           FROM stations
           WHERE id = $1
           RETURNING id`,
            [id],
        );
        const station = result.rows[0];

        if (!station) throw new NotFoundError("No station found");
    }
}


module.exports = Station;