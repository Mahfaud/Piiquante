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


module.exports = router;