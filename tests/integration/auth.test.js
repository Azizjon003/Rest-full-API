const request = require("supertest");
let server;

const { jwtToken } = require("../../controller/authController");

const User = require("../../model/user");
let token;
let userId;
let email;
let password;
describe("/api/v1/auth", () => {
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
    email = user.email;
    password = "Admin.1234";
    userId = user._id;
    token = jwtToken(user._id, user.role);
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });
  describe("POST /login", () => {
    const execute = async () => {
      let bearerToken = "Bearer " + token;
      return await request(server)
        .post("/api/v1/auth/login")
        .set("Authorization", bearerToken)
        .send({ email, password });
    };
    it("should return 404 if email empty", async () => {
      email = "";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 401 if email incorrect", async () => {
      email = "bahrom@gmail.com";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(401);
    });
    it("should return 401 if email correct and password length must 8 character", async () => {
      password = "Bahrom";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 401 if email correct and password incorrect", async () => {
      password = "Bahrom1234";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(401);
    });
    it("should return 200 if email and password correct", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });
  describe("POST /signup", () => {
    let data = {
      name: "Azizjon",
      surname: "Javlon",
      email: "azizjona@mail.com",
      password: "Azizjon1311",
      passwordConfirm: "Azizjon1311",
      jins: "erkak",
    };
    const execute = async () => {
      let bearerToken = "Bearer " + token;
      return await request(server)
        .post("/api/v1/auth/signup")
        .set("Authorization", bearerToken)
        .send(data);
    };
    it("should return 200 if email and password correct", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 400 if email empty", async () => {
      data.email = "";
      surname = " ";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if database has got a this email", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
  });
  describe("POST /updatePassword", () => {
    let data = {
      password: "Azizjon2003",
      passwordConfirm: "Azizjon2003",
      passwordCurrent: "Admin.1234",
    };
    const execute = async () => {
      let bearerToken = "Bearer " + token;
      return await request(server)
        .post("/api/v1/auth/updatepassword")
        .set("Authorization", bearerToken)
        .send(data);
    };

    it("should return if password corrent and jwt token correct ,new password must be 8 characters", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(200);
    });
    it("should return 401 if  token expired", async () => {
      token = "salom ";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(401);
    });
    it("should return 400 if passwordCurrent empty", async () => {
      data.passwordCurrent = "";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if passwordCurrent incorrect", async () => {
      data.passwordCurrent = " ";
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(400);
    });
  });

  describe("POST /updateme", () => {
    let data = {
      name: "Azizjon",
      surname: "Javlon",
    };
    const execute = async () => {
      let bearerToken = "Bearer " + token;
      return await request(server)
        .post("/api/v1/auth/updateme")
        .set("Authorization", bearerToken)
        .send(data);
    };
    it("should return 200 if name and surname correct", async () => {
      const res = await execute();
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("name");
    });
  });
});
