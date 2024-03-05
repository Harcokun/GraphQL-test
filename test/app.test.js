const request = require("supertest");
const app = require("../server.js");
const User = require("../models/User");
const PORT = process.env.PORT || 3000;
const baseUrl = "127.0.0.1:" + PORT + "/api/v1";

describe("Admin Flow", () => {
    let token = "";
    let id = "";
    beforeAll(async () => {

        // Wrong retype password
        await request(baseUrl)
            .post("/auth/register")
            .send({
                    name: "Test Admin 1",
                    email: "test_admin1@mail.com",
                    role: "admin",
                    password: "admin3939",
                    retype: "admin"
                })
            .expect(422);

        // correct retype password
        await request(baseUrl)
            .post("/auth/register")
            .send({
                    name: "Test Admin 1",
                    email: "test_admin1@mail.com",
                    role: "admin",
                    password: "admin3939",
                    retype: "admin3939"
                })
            .expect(200);
    });

    it('should log in', function(done) {
        request(baseUrl)
            .post('/auth/login')
            .send({
                email: "test_admin1@mail.com",
                password: "admin3939"
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                // Assert that the response body is an object with a token property
                expect(res.body).toHaveProperty('token');
                // Store the token for later use
                token = res.body.token;
                done();
            });
    });
    
    it('should get me', function(done) {
        request(baseUrl)
            .get('/auth/me')
            .auth(token, {type:'bearer'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
                res.body.data.length = "test_admin1@mail.com";
                res.body.data.name = "Test Admin 1";
            })
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.data).toHaveProperty('_id');
                expect(typeof res.body.data._id).toBe('string');
                id = res.body.data._id;
                done();
            });
    });

    it('should get all users', function(done) {
        request(baseUrl)
            .get('/user/')
            .auth(token, {type:'bearer'})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should update self', function(done) {
        const updateUserUrl = '/user/' + id;
        request(baseUrl)
            .put(updateUserUrl)
            .auth(token, {type:'bearer'})
            .send({
                name: "test admin 39",
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
                res.body.data.name = "test admin 39";
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should delete self', function(done) {
        const deleteUserUrl = '/user/' + id;
        request(baseUrl)
            .delete(deleteUserUrl)
            .auth(token, {type:'bearer'})
            .expect(204)
            .then(async () => {
                expect(await User.findOne({ _id: id })).toBeFalsy();
                done();
            })
            .catch((err) => done(err));
    });
    
});