var express = require('express');
const User = require('./UserModel');
var router = express.Router(); //http funktion

var userService = require("./UserService")
var authenticationService = require("../authentication/AuthenticationService")

//get all
router.get('/', (req, res) => {
    let reqHeader = req.headers['authorization']
    console.log(reqHeader)
    let parameterUserID = req.params.userID
    console.log(parameterUserID);
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }

    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: "Header is empty." })
        }
        userService.findAllUsers((err, result) => {
            if (result) {
                let newOutput = []
                result.forEach(e => {
                    const userWithoutPasswordOutput = {
                        userID: e.userID,
                        firstName: e.firstName,
                        lastName: e.lastName,
                        isAdministrator: e.isAdministrator
                    }
                    newOutput.push(userWithoutPasswordOutput)
                })
                res.status(200).json(newOutput)
            } else {
                res.status(500).json({ message: err.message })
            }
        })
    })
})

//get one
router.get('/:userID', (req, res) => {
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.userID
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }

    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            res.status(401).json({ message: "Header is empty." })
        }
        userService.findOneUser(parameterUserID, (err, result) => {
            if (result) {
                const newOutput = {
                    userID: result.userID,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    isAdministrator: result.isAdministrator
                }
                res.status(200).json(newOutput)
            } else {
                res.status(500).json({ error: 'User nicht gefunden.' })
            }
        })
    })
})

//create one
router.post('/', (req, res) => {
    let infoUser = req.body
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.userID
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }

    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            res.status(401).json({ message: "Header is empty." })
        }
        userService.createUser(infoUser, (err, result) => {
            if (result) {
                const newOutput = {
                    userID: result.userID,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    isAdministrator: result.isAdministrator
                }
                res.status(200).json(newOutput) //hat geklappt
            } else {
                res.status(400).json({ message: 'ERROR: User nicht erstellt.' })//User hat etwas falsch gemacht
            }
        })
    })
})

//update one
router.put('/:userID', async (req, res) => {
    let infoUserBody = req.body
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.userID
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }

    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            res.status(401).json({ message: "Header is empty." })
        }
        userService.updateUser(parameterUserID, infoUserBody, (err, result) => {
            if (result) {
                const newOutput = {
                    userID: result.userID,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    isAdministrator: result.isAdministrator
                }
                res.status(200).json(newOutput)
            } else {
                res.status(404).json({ message: 'ERROR: User nicht aktualisiert.' })
            }
        })
    })
})

//delete one
router.delete('/:userID', async (req, res) => {
    let delUser = req.params.userID
    
    userService.deleteUser(delUser, (err, result) => {
        if (result) {
            res.status(204).json({ message: 'User gelöscht.' })
        } else {
            res.status(404).json({ message: 'User nicht gefunden.' })
        }
    })
})

module.exports = router;

