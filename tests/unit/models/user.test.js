const User = require("../../../model/user");
const { jwtToken } = require("../../../controller/authController");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "test.env" });
describe("Generate Auth token", () => {
  it("should return a valid JWT", async () => {
    const user = new User({ role: "admin" });
    const token = jwtToken(user._id, user.role);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ isAdmin: true });
  });
});
