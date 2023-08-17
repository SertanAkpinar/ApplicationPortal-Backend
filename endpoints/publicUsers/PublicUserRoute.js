var express = require('express');
const User = require('./UserModel');
var router = express.Router();
var userService = require("./UserService")

//get all
router.get('/', (req, res) => {
    userService.findAllUsers((err, result) => {
        if (result) {
            res.send(result)
        } else {
            res.status(400).json({ message: err.message })
        }
    })
})

//get one
router.get('/:userID', (req, res) => {
    let infoUserID = req.params.userID
    userService.findOneUser(infoUserID, (err, result) => {
        if (result) {
            res.send(result)
        } else {
            res.status(400).json({ error: 'User nicht gefunden.' })
        }
    })
})

//create one
router.post('/', function (req, res) {
    let infoUser = req.body
    userService.createUser(infoUser, (err, result) => {
        if (result) {
            res.status(200).json(result) //hat geklappt
        }
        else {
            res.status(400).json({ message: 'ERROR: User nicht erstellt.' })//User hat etwas falsch gemacht
        }
    })
})

//update one
router.put('/:userID', async (req, res) => {
    let infoUser = req.params.userID //body
    let infoUserBody = req.body
    userService.updateUser(infoUser, infoUserBody, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({ message: 'ERROR: User nicht aktualisiert.' })
        }
    })
})

//delete one
router.delete('/:userID', async (req, res) => {
    let delUser = req.params.userID
    //callback("User nicht gefunden.", null)
    userService.deleteUser(delUser, (err, result) => {
        if (result) {
            res.status(204).json({ message: 'User gelöscht.' })
        } else {
            res.status(404).json({ message: 'User nicht gefunden.' })
        }
    })
})

module.exports = router;