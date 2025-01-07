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
db.sync()

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

app.post("/api/validate", async (req, res) => {
  const loggedOut = await LoggedOutToken.findOne(
    { token: req.header("token") }
  ).catch(err => err)
  if (loggedOut !== null || !validateAndParseToken(req)) {
    res.status(400).send("Invalid token")
    return
  }
  res.sendStatus(200)
})

app.listen(5000, () => {
  console.log("User service started")
})

module.exports = app;
