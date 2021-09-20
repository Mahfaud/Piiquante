const Sauce = require ("../model/Sauce")


// Fonction qui crée une sauce et l'envoie dans la base de donnée
exports.createOneSauce = async (req, res) => {
    const body = JSON.parse(req.body.sauce)
    
    const sauceSchema = new Sauce({
        userId: body.userId,
        name: body.name,
        manufacturer: body.manufacturer ,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        description: body.description,
        mainPepper: body.mainPepper,
        heat: body.heat,
        likes: 0,
        dislikes: 0,
        usersLiked : [],
        usersDisliked: []
        })
        try {
            const sauceSaved = await sauceSchema.save()
            res.status(200).send(sauceSaved)
        } catch(err) {
            res.status(400).send(err)
        }
}

// Récupère toutes les sauces de la base de donnée et les envoie au front-end
exports.getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).send(sauces)
    } catch(err) {
        res.status(404).send("Error")
    }
}

// Récupère une seul sauce en fonction de l'id qui se trouve dans l'URL et l'envoie au front-end
exports.getOneSauce = async (req, res) => {
    try {
        const oneSauce = await Sauce.findById(req.params.id)
        res.status(200).send(oneSauce)
    } catch(err) {
        res.status(404).send("Error")
    }
}

// Supprime une seule sauce en fonction de l'id qui se trouve dans l'URL et l'envoie au front-end
exports.deleteOneSauce = async (req, res) => {
    try {
        const removeSauce = await Sauce.deleteOne({_id: req.params.id})
        res.status(200).send(removeSauce)
    } catch(err) {
        res.status(404).send("Error")
    }
}

// Modifie une sauce en fonction des choix de l'utilisateur si aucune image est modifiée on gardera l'ancienne.
exports.modifyOneSauce = async (req, res) => {
    const updateSauce = {
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer ,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        usersLiked : [],
        usersDisliked: []
    }

    if (req.file) {
        updateSauce.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    } else {
        updateSauce.imageUrl = req.body.imageUrl
    }

    const updatedSauce = await Sauce.updateOne({_id: req.params.id}, {$set: updateSauce})
    res.status(200).send(updatedSauce)
}

// Fonction qui ajoute l'utilisateur dans l'array UsersLikes/UsersDisliked  et ajoute +1 dans les likes ou dislikes
// Dans le cas ou l'utilisateur enleve son like/dislike on enlevera -1

exports.createLikes = (req,res) => {
    if (req.body.like === 1) {
        try {
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
            .then(()=> {
                res.status(200).send({message: "Like"})})
        } catch(err) {
            res.status(500).send({message: "Erreur"})
        }
    }
    if (req.body.like === -1) {
        try {
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
            .then(()=> {
                res.status(200).send({message: "Dislike"})})
        } catch(err) {
            res.status(500).send({message: "Erreur"})
        }
    }
    if (req.body.like === 0) {
        try {
            Sauce.findOne({ _id: req.params.id })
            .then( (data) => {
                if (data.usersLiked.includes(req.body.userId)) { 
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                    .then(() => {
                        res.status(200).send({message: "Cancel Like " })})
                  }
                if (data.usersDisliked.includes(req.body.userId)) { 
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
                    .then(() => {
                        res.status(200).send({message: "Cancel Dislike" })})
                  }
            })
        } catch(err) {
            res.status(500).send({message: "Erreur"})
        }
    }
}