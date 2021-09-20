const mongoose = require('mongoose')

// Model de l'utilisateur
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    password: {
        type: String,
        required: true,
        min: 6
    }
})

module.exports = mongoose.model("User", userSchema)