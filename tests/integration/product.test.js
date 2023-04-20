const request = require("supertest");
let server;
const { jwtToken } = require("../../../controller/authController");
const Product = require("../../model/product");
const User = require("../../model/user");

describe("/api/products", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    server.close();
    await Product.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all products", async () => {
      await Product.collection.insertMany([
        {
          name: "product1",
          price: 10,
          description: "product1 description",
          category: "category1",
          image: "image1",
          salePrice: 5,
          description: "product1 description",
          expire: "2021-01-01",
        },
        {
          name: "product2",
          price: 10,
          description: "product2 description",
          category: "category2",
          image: "image2",
          salePrice: 5,
          description: "product2 description",
          expire: "2021-01-01",
        },
        {
          name: "product3",
          price: 10,
          description: "product3 description",
          category: "category3",
          image: "image3",
          salePrice: 5,
          description: "product3 description",
          expire: "2021-01-01",
        },
      ]);
      const res = await request(server).get("/api/v1/products");
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(3);
      expect(
        res.body.data.products.some((p) => p.name === "product1")
      ).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a product if valid id is passed", async () => {
      const product = await Product.create({
        name: " ",
        price: 10,
        description: "product1 description",
        category: "category1",
        image: "image1",
        salePrice: 5,
        description: "product1 description",
        expire: "2021-01-01",
      });
      const res = await request(server).get("/api/v1/products/" + product._id);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(product.name);
      expect(res.body.data.price).toBe(product.price);
      expect(res.body.data).toHaveProperty("description");
    });
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/v1/products/1");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    let token;
    let data = {
      name: "product3",
      price: 10,
      description: "product3 description",
      category: "category3",
      image: "image3",
      salePrice: 5,
      description: "product3 description",
      expire: "2021-01-01",
    };

    beforeEach(async () => {
      const user = await User.create({
        name: "AdminA",
        surname: "TestUser",
        email: "admin@gmail.com",
        password: "Admin.1234",
        jins: "erkak",
        role: "admin",
      });
      token = jwtToken(user._id, user.role);
    });
    const execute = async () => {
      let bearerToken = "Bearer " + token;
      return await request(server)
        .post("/api/v1/products")
        .set("Authorization", bearerToken)
        .send(data);
    };
    it("should return create products", async () => {});
  });
});
