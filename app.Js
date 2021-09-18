const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require("dotenv").config()

// Connexion à la DataBase
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true})
.then(
  () => console.log("Database ON"))
  .catch(() =>{
    console.log("Database OFF")
  })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Middlewares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.listen(3000)