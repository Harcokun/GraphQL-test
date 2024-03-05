const request = require("supertest");

const app = require("../server.js");
const PORT = process.env.PORT || 3000;
const baseUrl = "127.0.0.1:" + PORT + "/api/v1";

describe("Register, Login, GetMe, Delete Flow", () => {
    let token = "";
    let id = "";
    beforeAll(async () => {
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
                console.log(token);
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

    it('should delete user', function(done) {
        const deleteUserUrl = '/user/' + id;
        request(baseUrl)
            .delete(deleteUserUrl)
            .auth(token, {type:'bearer'})
            .expect(204)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    
});