const router = require("express").Router();
const {upload} = require("../middleware/uploads")
const authorize = require("../middleware/authorize");
const sauceControllers = require("../controllers/sauce")

// Route POST pour ajouter une sauce
router.post("/", upload.single("image"), authorize, sauceControllers.createOneSauce)

// Route GET qui affiche toutes les sauces
router.get("/", authorize ,sauceControllers.getAllSauces)

// Route GET qui affiche une sauce en fonction de l'ID
router.get("/:id", authorize, sauceControllers.getOneSauce)

// Route DELETE qui supprime une sauce en fonction de l'ID
router.delete("/:id", authorize,  sauceControllers.deleteOneSauce)

// Route PUT qui modifie une sauce
router.put("/:id", upload.single("image") , authorize,  sauceControllers.modifyOneSauce)

// Route POST qui ajoute une logique de like/dislike sur une sauce
router.post("/:id/like", authorize, sauceControllers.createLikes)

module.exports = router;