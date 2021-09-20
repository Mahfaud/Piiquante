const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
let emailRegex = /(?:\s|^)(?![a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\S+\b(?=\s|$)/ig
var validInput = true

// Fonction qui permets de voir si l'input de l'utilisateur respecte un nombre minimal et maximal de lettre précis ainsi que le regex
function filterUserInput(minLetter, maxLetter, input, regex) {
    if (input.length > maxLetter || regex.test(input) || input.length < minLetter) {
        validInput = false
    }
}


exports.createAccount = async (req,res) => {

    // Utilisation de la fonction  filterUserInput pour vérifier si les inputs sont respectent certains critères
    filterUserInput(6, 100, req.body.email, emailRegex)
    filterUserInput(6, 1050, req.body.password, /A-zÀ-ÿ/g)

    // On regarde si l'email entrée par l'utilisateur est déja dans la base de donnée ou non renvoie une erreur si c'est le cas
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) {
        return res.status(400).send("Email already exists")
    }

    // Hashage du mot de passe

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // Si les inputs sont bons, crée un user et essaye de le sauvegarder dans la base de donnée sinon envoie une erreur
    if (validInput) {
        const user = new User({
            email: req.body.email,
            password: hashPassword
        });
        try {
            const userSaved = await user.save()
            res.send({message: userSaved})
        } catch(err) {
            res.status(500).send(err)
        }
    }  else {
        res.send("Bad Input")
    }
}

exports.logIn = async (req, res) => {

    // Utilisation de la fonction  filterUserInput pour vérifier si les inputs sont respectent certains critères
    filterUserInput(6, 100, req.body.email, emailRegex)
    filterUserInput(6, 1050, req.body.password, /A-zÀ-ÿ/g)


    if (validInput) {
        // On regarde si l'email entrée par l'utilisateur est déja dans la base de données
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).send("Email or password is wrong")
        }

        // On regarde si le mot de passe correspond
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if (!validPass) {
            return res.status(400).send("Wrong password")
        }

        // Création d'un JSON Web Token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '24h' })


        res.status(200).send({userId: user._id, token: token})

    } else {
        return res.status(400).send("Email or password is wrong")
    }
}