const data = {
  name: "product3",
  price: 10,
  salePrice: 5,
  description: "product3 description jfksjfnsdnfsndf sdkfnsdkj",
  category: "category3",
  image: "image3",
  expire: "2021-01-01",
};

const dataArray = [];

for (let i = 0; i < 20; i++) {
  let newData = { ...data }; // Yangi obyekt yaratish uchun obyektni nusxalash
  newData.name += " " + (i + 1); // Har bir yangi obyektda nomni o'zgartirish
  dataArray.push(newData); // Yangi obyektni dataArray ichiga qo'shish
}

console.log(dataArray); // 20 ta JSON obyektlarini o'z ichiga olgan arrayni konsolga chiqaramiz
const dotenv = require("dotenv");
dotenv.config();
const Product = require("../model/product");
const connection = require("../model/connection");
let dbUrl = process.env.DB;
const dbPass = process.env.DB_PASS;
dbUrl = dbUrl.replace("<password>", dbPass);
const entity = async () => {
  await connection(dbUrl);
  await Product.insertMany(dataArray);
};
entity()
  .then(() => console.log("Data inserted"))
  .catch((err) => console.log(err));
