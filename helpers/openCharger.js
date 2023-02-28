const axios = require('axios');
const { search } = require('../routes/user');

/**
 * Function for making a request to Open Charger Map API => list of chargers near location.
 */
const BASE_URL = "https://api.openchargemap.io/v3/poi/";

const API_KEY = process.env.OPEN_MAP_CHARGER_API;

module.exports.getEVChargers = async function (data) {
    let { lat, lng, maxResult, charger_type } = data;

    if (!maxResult) {
        maxResult = 15;
    }

    const params = {
        "key": API_KEY,
        "latitude": lat,
        "longitude": lng,
        "maxresults": maxResult,
        "connectiontypeid": charger_type
    }

    const res = await axios.get(
        BASE_URL, {
        params
    });

    const searchResults = [];

    res.data.forEach((s) => {
        searchResults.push(s)

    });

    return searchResults;
}

