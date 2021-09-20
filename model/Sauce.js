const mongoose = require("mongoose")

const requiredString = {
    type: String,
    required: true
}

const requiredNumber = {
    type: Number,
    required: true
}


// Model d'une sauce
const sauceSchema = new mongoose.Schema({
        userId: requiredString,
        name: requiredString,
        manufacturer: requiredString,
        description: requiredString,
        mainPepper: requiredString,
        imageUrl: requiredString,
        heat: requiredNumber,
        likes: requiredNumber,
        dislikes: requiredNumber,
        // Array de string d'users Id
        usersLiked: [requiredString],
        usersDisliked: [requiredString]
    
})

module.exports = mongoose.model("Sauce", sauceSchema)