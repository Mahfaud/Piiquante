const router = require("express").Router();
const {upload} = require("../middleware/uploads")
const authorize = require("../middleware/authorize");
const sauceControllers = require("../controllers/sauce")

router.post("/", upload.single("image"), sauceControllers.createOneSauce)

router.get("/", sauceControllers.getAllSauces)

router.get("/:id", sauceControllers.getOneSauce)

router.delete("/:id", sauceControllers.deleteOneSauce)

router.put("/:id", upload.single("image") , sauceControllers.modifyOneSauce)

router.post("/:id/like", sauceControllers.createLikes)

module.exports = router;