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


module.exports = router;