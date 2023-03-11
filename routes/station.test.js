/**
 * Test '/station' API endpoints. 
 * 
 * POST, GET, DELETE /station 
 * 
 */
const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** GET /station */

describe("GET /station/:id", function () {
    test("get station data", async function () {
        const resp = await request(app).get(`/station/${123}`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            station: {
                id: 123,
                name: "JFK Supercharger",
                address: "123 Address JFK Queens NY, NY",
                lat: "40.641312",
                long: "-73.778137",
                charger_type: "27",
                phone: "123-456-789",
                email: "JFKcharger@email.com",
                available: 10,
            }
        })
    });

    test("bad request on invalid station id", async function () {
        const resp = await request(app)
            .get(`/station/idOne`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** POST /station */

describe("POST /station", function () {
    test("post to stations for logged in user/curr user", async function () {
        const resp = await request(app)
            .post(`/station`)
            .send({
                id: 227246,
                name: "Roosevelt Field - Tesla Supercharger",
                address: "630 Old Country Road NY 11530",
                lat: "40.741602",
                long: "-73.613058",
                charger_type: "12",
                phone: "877-798-3752",
                email: "",
                available: 12,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            station: {
                id: 227246,
                name: "Roosevelt Field - Tesla Supercharger",
                address: "630 Old Country Road NY 11530",
                lat: "40.741602",
                long: "-73.613058",
                charger_type: "12",
                phone: "877-798-3752",
                email: "",
                available: 12,
            },
        });
    });

    test("unauth for users", async function () {
        const resp = await request(app)
            .post(`/station`)
            .send({
                id: 227246,
                name: "Roosevelt Field - Tesla Supercharger",
                address: "630 Old Country Road NY 11530",
                lat: "40.741602",
                long: "-73.613058",
                charger_type: "12",
                phone: "877-798-3752",
                email: "",
                available: 12,
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing station id", async function () {
        const resp = await request(app)
            .post(`/station`)
            .send({
                name: "Roosevelt Field - Tesla Supercharger",
                address: "630 Old Country Road NY 11530",
                lat: "40.741602",
                long: "-73.613058",
                charger_type: "12",
                phone: "877-798-3752",
                email: "",
                available: 12,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post(`/station`)
            .send({
                name: "Roosevelt Field - Tesla Supercharger",
                address: "630 Old Country Road NY 11530",
                lat: "",
                long: "-73.613058",
                charger_type: "12",
                phone: "877-798-3752",
                email: "",
                available: 12,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});


/************************************** DELETE /station */

describe("DELETE /station/:id", function () {
    test("works logged in/curr user", async function () {
        const resp = await request(app)
            .delete(`/station/${123}`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: 123 });
    });
    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/station/${123}`)
        expect(resp.statusCode).toEqual(401);
    });

    test("not found station", async function () {
        const resp = await request(app)
            .delete(`/station/0`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});
