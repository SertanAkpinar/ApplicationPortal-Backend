var express = require('express')
var router = express.Router()
var dcAppService = require('./degreeCourseApplicationService')
var authenticationService = require('../authentication/AuthenticationService')

router.get('/', (req, res) => {
    // let reqHeader = req.headers['authorization']
    // authenticationService.isUserAuthorized(reqHeader, req.params.userID, (err, user) => {
    //     if (err || user === false) {
    //         return res.status(401).json({ message: "Header is empty." })
    //     }
        dcAppService.findAllApplications((err, result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(400).json({ message: err.message })
            }
        })
    })
// })

router.get('/myApplications', (req, res) => {
    const username = authenticationService.getUserIDFromToken(req.headers["authorization"])
    dcAppService.findAllApplicationsForUser(username, (err, result) => {
        if (result) {
            res.status(201).json(result)
        } else {
            res.status(400).json({ message: err.message })
        }
    })
})

router.post('/', (req, res) => {
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.userID
    let infoApplication = req.body
    console.log(reqHeader)
    console.log(req.params.id + " id")
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }
    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: 'Nicht möglich zu erstellen.' })
        }
        // const username = authenticationService.getUserIDFromToken(req.headers["authorization"])
        dcAppService.createDegreeCourseApplication(infoApplication, (err, result) => { //username, req.body, (err, result) => {
            if (result) {
                res.status(201).json(result)
            } else {
                res.status(400).json({ message: 'Nicht erstellt.' })
            }
        })
    })
})

router.put('/:id', async (req, res) => {
    let infoDegreeCourseBody = req.body
    let reqHeader = req.headers['authorization']
    let parameterApplicationID = req.params.id
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }
    authenticationService.isAuthorized(reqHeader, parameterApplicationID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: "Header is empty." })
        }
        dcAppService.updateApplication(parameterApplicationID, infoDegreeCourseBody, (err, result) => {
            if (result) {
                res.status(201).json(result)
            } else {
                res.status(400).json({ message: 'Error: Update nicht möglich.' })
            }
        })
    })
})

router.delete('/:_id', async (req, res) => {
    let delApplication = req.params._id
    dcAppService.deleteApplication(delApplication, (err, result) => {
        if (result) {
            res.status(204).json({ message: 'Application gelöscht.' })
        } else {
            res.status(404).json({ message: 'Application nicht gefunden.' })
        }
    })
})


module.exports = router