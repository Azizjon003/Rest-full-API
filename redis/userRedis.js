const redis = require("./connection");
const { promisify } = require("util");
const getUser = async (id) => {
  const getAsync = promisify(redis.get).bind(redis);
  const user = await getAsync("getUser:" + id);
  return user;
};

const setUser = async (user) => {
  const setAsync = promisify(redis.set).bind(redis);
  const user = await setAsync("getUser:" + user._id, JSON.stringify(user));
  return user;
};
const deleteUser = async (id) => {
  const delAsync = promisify("getUser:" + user._id).bind(redis);
  const user = await delAsync(id);
  return user;
};
const getAllUserRedis = async () => {
  const getAsync = promisify(redis.keys).bind(redis);
  const users = await getAsync("getUser:*");
  let data = users.map((el) => {
    return JSON.parse(el);
  });
  return data;
};
module.exports = {
  getUser,
  setUser,
  deleteUser,
  getAllUserRedis,
};
