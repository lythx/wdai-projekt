const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const { generateToken, validateAndParseToken } = require("./tokenService.js")
const cors = require("cors")

const app = express();
const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});
const User = db.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
const LoggedOutToken = db.define('LoggedOutToken', {
  token: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
const Order = db.define('Order', {
  user: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  order: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})
db.sync()

let products = []
let categories = []

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post("/api/register", async (req, res) => {
  const sameEmail = await User.findOne(
    { where: { email: req.body.email } }
  ).catch(err => err)
  if (sameEmail !== null) {
    res.status(400).send("User already exists")
    return
  }
  const newUser = await User.create(
    { email: req.body.email, password: req.body.password, name: req.body.name, surname: req.body.surname }
  ).catch(err => err)
  if (newUser instanceof Error) {
    res.status(400).send("Incorrect data in body")
    return
  }
  db.sync()
  res.send({ id: newUser.id })
})

app.post("/api/login", async (req, res) => {
  const user = await User.findOne(
    { where: { email: req.body.email, password: req.body.password } }
  ).catch(err => err)
  if (user instanceof Error || user === null) {
    res.status(400).send("No such user")
    return
  }
  const token = generateToken(user.id)
  res.send({ token })
})

app.post("/api/logout", async (req, res) => {
  const status = await LoggedOutToken.create(
    { token: req.body.token }
  ).catch(err => err)
  if (status instanceof Error) {
    res.status(400).send("Failed to logout")
    return
  }
  res.sendStatus(200)
})

async function validateAndGetUser(req) {
  const loggedOut = await LoggedOutToken.findOne(
    { where: { token: req.header("token") } }
  ).catch(err => err)
  if (loggedOut !== null) {
    return false
  }
  return validateAndParseToken(req)
}

app.post("/api/validate", async (req, res) => {
  if (!checkIfValidAndNotLoggedOut(req.header("token"))) {
    res.status(400).send("Invalid token")
    return
  }
  res.sendStatus(200)
})

app.get("/api/products", async (req, res) => {
  res.send(JSON.stringify(products))
})

app.get("/api/categories", async (req, res) => {
  res.send(JSON.stringify(categories))
})

app.get("/api/product/:id", async (req, res) => {
  const product = products.find(a => a.id === Number(req.params.id))
  if (product === undefined) {
    res.sendStatus(404)
    return
  }
  res.send(JSON.stringify(product))
})

app.post("/api/order", async (req, res) => {
  const user = validateAndGetUser(req)
  if (user === false) {
    res.sendStatus(403)
    return
  }
  for (const orderedProduct of req.body) {
    const product = products.find(a => a.id === orderedProduct.id)
    if (product === undefined || product.quantity < orderedProduct.quantity) {
      orderedProduct.quantity = 0
    } else {
      product.quantity -= orderedProduct.quantity
    }
  }
  Order.create(
    { user: user.id, order: JSON.stringify(req.body.products) }
  ).catch(err => err)
  res.sendStatus(200)
})

app.get("/api/orders", async (req, res) => {
  const user = validateAndGetUser(req)
  if (user === false) {
    res.sendStatus(403)
    return
  }
  const orders = await Order.findAll(
    { where: { user: user.id } }
  ).catch(err => err)
  if (orders instanceof Error) {
    res.sendStatus(400)
    return
  }
  res.status(200).send(JSON.stringify(orders))
})

app.listen(5000, async () => {
  const productsRes = await fetch("https://fakestoreapi.com/products")
  const productsData = await productsRes.json()
  products = productsData.map(a => ({ ...a, quantity: parseInt(Math.random() * 40) + 10 }))
  const categoriesRes = await fetch("https://fakestoreapi.com/products/categories")
  const categoriesData = await categoriesRes.json()
  categories = categoriesData
})

module.exports = app;
