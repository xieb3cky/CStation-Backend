/**
 * Test '/user' API endpoint. 
 * 
 * POST, GET, PATCH, DELETE /user & user/favorites
 * 
 */
const request = require("supertest");

const db = require("../db.js");
const app = require("../app");


const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    favoritesId
} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /user */

describe("GET /user", function () {
    test("get user information", async function () {
        const resp = await request(app)
            .get("/user/u1")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            users: [
                {
                    username: "u1",
                    firstName: "U1F",
                    lastName: "U1L",
                    email: "user1@user.com",
                },
            ],
        });
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .get("/user/u1");
        expect(resp.statusCode).toEqual(401);
    });
});

/************************************** PATCH /user/:username */

describe("PATCH /user/:username", () => {

    test("works for same user", async function () {
        const resp = await request(app)
            .patch(`/user/u1`)
            .send({
                firstName: "New",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            user: {
                username: "u1",
                firstName: "New",
                lastName: "U1L",
                email: "user1@user.com",
            },
        });
    });

    test("unauth if not same user", async function () {
        const resp = await request(app)
            .patch(`/user/u1`)
            .send({
                firstName: "New",
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .patch(`/user/u1`)
            .send({
                firstName: "New",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if no such user", async function () {
        const resp = await request(app)
            .patch(`/user/nope`)
            .send({
                firstName: "Nope",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("bad request if invalid data", async function () {
        const resp = await request(app)
            .patch(`/user/u1`)
            .send({
                firstName: 42,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /user/:id */

describe("DELETE /user/:id", function () {
    test("works for same user", async function () {
        const resp = await request(app)
            .delete(`/user/1`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: "1" });
    });

    test("unauth if not same user", async function () {
        const resp = await request(app)
            .delete(`/user/u1`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/user/u1`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if user missing", async function () {
        const resp = await request(app)
            .delete(`/user/9999999`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************** POST /user/favorites */
describe("POST /user/favorites", function () {

    test("works for same user", async function () {
        const resp = await request(app)
            .post(`/user/favorites`)
            .send({
                user_id: 1,
                station_id: 456
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ favorited: testJobIds[0] });
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .post(`/user/favorites`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found for no such username", async function () {
        const resp = await request(app)
            .post(`/user/favorites`)
            .send({
                user_id: 9999,
                station_id: 456
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("not found for station", async function () {
        const resp = await request(app)
            .post(`/user/favorites`)
            .send({
                user_id: 1,
                station_id: 9999
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });

});
/************************************** DELETE /user/:username/delete-favorite */

describe("DELETE /user/delete-favorite", function () {
    test("works for same user", async function () {
        const resp = await request(app)
            .delete(`/user/delete-favorite`)
            .send({
                user_id: 1,
                station_id: 456
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: "456" });
    });


    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/user/delete-favorite`)
            .send({
                user_id: 1,
                station_id: 456
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if user missing", async function () {
        const resp = await request(app)
            .delete(`/user/delete-favorite`)
            .send({
                user_id: 99999,
                station_id: 456
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});
