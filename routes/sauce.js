const router = require("express").Router();
const Sauce = require ("../model/Sauce")
const {upload} = require("../middleware/uploads")
const authorize = require("../middleware/authorize");
const { Mongoose } = require("mongoose");

router.post("/", upload.single("image"), async (req, res) => {
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
            res.send(sauceSaved)
        } catch(err) {
            res.status(400).send(err)
        }
})

router.get("/", async (req, res) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).send(sauces)
    } catch(err) {
        res.status(400).send("Error")
    }
})

router.get("/:id", async (req, res) => {
    try {
        const oneSauce = await Sauce.findById(req.params.id)
        res.status(200).send(oneSauce)
    } catch(err) {
        res.status(400).send("Error")
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const removeSauce = await Sauce.deleteOne({_id: req.params.id})
        res.status(200).send(removeSauce)
    } catch(err) {
        res.status(400).send("Error")
    }
})

router.put("/:id", upload.single("image") ,async (req, res) => {
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
})

router.post("/:id/like", (req,res) => {
    if (req.body.like === 1) {
        try {
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
            .then(()=> {
                res.status(200).send({message: "Like"})})
        } catch(err) {
            res.status(400).send({message: "Erreur"})
        }
    }
    if (req.body.like === -1) {
        try {
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
            .then(()=> {
                res.status(200).send({message: "Dislike"})})
        } catch(err) {
            res.status(400).send({message: "Erreur"})
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
            res.status(400).send({message: "Erreur"})
        }
    }
})

module.exports = router;