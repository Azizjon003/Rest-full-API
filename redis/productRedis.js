const redis = require("./connection");
const { promisify } = require("util");
const getProduct = async (id) => {
  const getAsync = promisify(redis.get).bind(redis);
  const product = await getAsync("getProduct:" + id);
  return product;
};

const setProduct = async (user) => {
  const setAsync = promisify(redis.set).bind(redis);
  const product = await setAsync(
    "getProduct:" + user._id,
    JSON.stringify(user)
  );
  return product;
};
const deleteProduct = async (id) => {
  const delAsync = promisify("getProduct:" + user._id).bind(redis);
  const product = await delAsync(id);
  return product;
};
const getAllProductRedis = async () => {
  const getAsync = promisify(redis.keys).bind(redis);
  const products = await getAsync("getProduct:*");
  let data = products.map((el) => {
    return JSON.parse(el);
  });
  return data;
};
module.exports = {
  getProduct,
  setProduct,
  deleteProduct,
  getAllProductRedis,
};
