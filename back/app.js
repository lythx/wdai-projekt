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
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
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
const Opinion = db.define('Opinion', {
  user: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  stars: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT,
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
    { email: req.body.email, password: req.body.password, name: req.body.name, surname: req.body.surname, isAdmin: false }
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
    { token: req.header("token") ?? "" }
  ).catch(err => err)
  console.log(status)
  if (status instanceof Error) {
    res.status(400).send("Failed to logout")
    return
  }
  db.sync()
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
  if (!(await validateAndGetUser(req))) {
    res.status(400).send("Invalid token")
    return
  }
  res.sendStatus(200)
})

app.get("/api/user", async (req, res) => {
  const r = await validateAndGetUser(req)
  if (!r) {
    res.status(400).send("Invalid token")
    return
  }
  const user = await User.findOne(
    { where: { id: r.id } }
  ).catch(err => err)
  if (user === null || user instanceof Error) {
    res.status(400).send("Invalid token")
    return
  }
  res.status(200).send(JSON.stringify(user))
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
  const user = await validateAndGetUser(req)
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
  await Order.create(
    { user: user.id, order: JSON.stringify(req.body) }
  ).catch(err => err)
  db.sync()
  res.sendStatus(200)
})

app.get("/api/orders", async (req, res) => {
  const user = await validateAndGetUser(req)
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
  res.status(200).send(JSON.stringify(orders.map(a => ({
    id: a.id,
    date: a.createdAt,
    items: JSON.parse(a.order)
  }))))
})

app.post('/api/opinion', async (req, res) => {
  const user = await validateAndGetUser(req)
  console.log('===================')
  console.log(user)
  console.log(req.body)
  if (user === false) {
    res.sendStatus(403)
    return
  }
  const status = await Opinion.create(
    { product: req.body.product, user: user.id, stars: req.body.stars, text: req.body.text, name: req.body.name, surname: req.body.surname }
  ).catch(err => err)
  console.log(status)
  db.sync()
  res.sendStatus(200)
})

app.delete('/api/opinion', async (req, res) => {
  const user = await validateAndGetUser(req)
  if (user === false) {
    res.sendStatus(403)
    return
  }
  const opinion = await Opinion.findOne(
    { id: req.body.id }
  ).catch(err => err)
  console.log(await opinion.destroy())
  db.sync()
  res.sendStatus(200)
})

app.get('/api/opinions/:product', async (req, res) => {
  res.status(200).send(await Opinion.findAll(
    { where: { product: Number(req.params.product) } }
  ))
})

app.listen(5000, async () => {
  const productsRes = await fetch("https://fakestoreapi.com/products")
  const productsData = await productsRes.json()
  products = productsData.map(a => ({ ...a, quantity: parseInt(Math.random() * 40) + 10 }))
  const categoriesRes = await fetch("https://fakestoreapi.com/products/categories")
  const categoriesData = await categoriesRes.json()
  categories = categoriesData
  console.log('api fetch complete')

  // await User.create(
  //   { email: "mateusz.jarosz@agh.edu.pl", password: "admin", name: "Mateusz", surname: "Jarosz", isAdmin: true })
  // await User.create(
  //   { email: "szuk@student.agh.edu.pl", password: "admin", name: "Szymon", surname: "Żuk", isAdmin: true })
  // await User.create(
  //   { email: "zak@student.agh.edu.pl", password: "admin", name: "Dawid", surname: "Żak", isAdmin: true })

})

module.exports = app;



