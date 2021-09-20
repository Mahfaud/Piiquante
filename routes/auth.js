const router = require("express").Router();
const authControllers = require("../controllers/auth")


// Route POST pour la création d'un compte
router.post("/signup", authControllers.createAccount);

// Route POST pour la connexion à un compte
router.post("/login", authControllers.logIn)


module.exports = router;