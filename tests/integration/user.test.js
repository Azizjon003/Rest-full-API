const request = require("supertest");
let server;

const { jwtToken } = require("../../controller/authController");

const User = require("../../model/user");

let token;
let userId;
describe("api/users", () => {
  beforeEach(async () => {
    server = require("../../server");
    const user = await User.create({
      name: "AdminA",
      surname: "TestUser",
      email: "adminjon@gmail.com",
      password: "Admin.1234",
      jins: "erkak",
      role: "admin",
    });
    userId = user._id;
    token = jwtToken(user._id, user.role);
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  describe("GET /", () => {
    const execute = async () => {
      let bearerToken = "Bearer " + token;

      return await request(server)
        .get("/api/v1/users")
        .set("Authorization", bearerToken);
    };

    it("should return all users getUpdate", async () => {
      const res = await execute();
      expect(res.status).toBe(200);
    });
    it("should return error if user isn't role admin ", async () => {
      const user = await User.create({
        name: "AdminA",
        surname: "TestUser",
        email: "azizjon@gmail.com",
        password: "Admin.1234",
        jins: "erkak",
        role: "user",
      });
      token = jwtToken(user._id, user.role);
      const res = await execute();
      expect(res.status).toBe(401);
    });
    it("should return all users if token empty", async () => {
      token = "";
      const res = await execute();
      expect(res.status).toBe(401);
    });
  });
  describe("GET /:id", () => {
    const execute = async (id) => {
      let bearerToken = "Bearer " + token;

      return await request(server)
        .get("/api/v1/users/" + id)
        .set("Authorization", bearerToken);
    };
    it("should return 401 if token is empty", async () => {
      token = "";
      const res = await execute("empty");
      expect(res.status).toBe(401);
    });
    it("should return user if valid id is passed", async () => {
      const res = await execute("salom");
      expect(res.status).toBe(400);
    });

    it("should return 200 if invalid id is passed", async () => {
      const user = await User.create({
        name: "AdminA",
        surname: "TestUser",
        email: "zafar@gmail.com",
        password: "Admin.1234",
        jins: "erkak",
        role: "admin",
      });

      const res = await execute(user._id);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("name", "surname", "jinsi");
    });

    it("should return error 401", async () => {
      const user = await User.create({
        name: "AdminA",
        surname: "TestUser",
        email: "azizjon@gmail.com",
        password: "Admin.1234",
        jins: "erkak",
        role: "user",
      });
      token = jwtToken(user._id, user.role);
      const res = await execute(user._id);
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /:id", () => {
    const execute = async (id, fields) => {
      let bearerToken = "Bearer " + token;

      return await request(server)
        .patch("/api/v1/users/" + id)
        .set("Authorization", bearerToken)
        .send(fields);
    };

    it("should return 401 error if User jwt not found", async () => {
      token = "";
      const response = await execute(userId, { name: "Azizjon" });
      expect(response.status).toBe(401);
    });
    it("should return 400 if invalid id passed", async () => {
      const response = await execute("salom", { name: "Azizjon" });
      expect(response.status).toBe(400);
    });
    it("should return 200 if id and body true", async () => {
      let data = {
        name: "Bahrom",
        surname: "Bahromov",
      };
      const response = await execute(userId, data);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data.name).toBe("Bahrom");
      expect(response.body.data.surname).toBe("Bahromov");
    });
  });
  describe("DELETE /:id", () => {
    const execute = async (id) => {
      let bearerToken = "Bearer " + token;

      return await request(server)
        .delete("/api/v1/users/" + id)
        .set("Authorization", bearerToken);
    };
    it("should return 401 error if User jwt not found", async () => {
      token = "";
      const response = await execute(userId);
      expect(response.status).toBe(401);
    });

    it("should return 400 if invalid id passed", async () => {
      const response = await execute("salom");
      expect(response.status).toBe(400);
    });
    it("should return 200 if id and body true", async () => {
      const response = await execute(userId);
      expect(response.status).toBe(204);
    
    });
  });
});
