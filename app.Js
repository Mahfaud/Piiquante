const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require("dotenv").config()
const authRoute = require("./routes/auth")
const sauceRoute = require("./routes/sauce")
const path = require('path');

// Connexion à la DataBase
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true})
.then(
  () => console.log("Database ON"))
  .catch(() =>{
    console.log("Database OFF")
  })


// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentifications Routes
app.use("/api/auth", authRoute)
app.use("/api/sauces", sauceRoute)

// Application qui écoute au port 3000
app.listen(3000)