var express = require('express')
const degreeCourse = require('./degreeCourseModel')
var router = express.Router();
var degreeCourseService = require('./degreeCourseService')
var authenticationService = require('../authentication/AuthenticationService')
var dcAppService = require('../degreeCourseApplication/degreeCourseApplicationService')

router.get('/', (req, res) => {
    degreeCourseService.findAllDegreeCourses((err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: err.message })
        }
    })
})

router.get('/:_id', (req, res) => {
    let degreeID = req.params._id
    console.log(degreeID, "degreeid testttt");
    console.log(req.params.id, "req.params._id testttttt");
    degreeCourseService.findOneDegreeCourse(req.params._id, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: err.message })
        }
    })
})

router.get('/:id/degreeCourseApplications', (req, res) => {
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.id
    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: "Header is empty." })
        }
        dcAppService.findAllApplications( (err, result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(400).json({ message: err.message })
            }
        })
    })
})

router.post('/', (req, res) => {
    let infoDegreeCourse = req.body
    let reqHeader = req.headers['authorization']
    let parameterUserID = req.params.userID
    console.log(parameterUserID)
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }
    authenticationService.isAuthorized(reqHeader, parameterUserID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: "Header is empty." })
        }

        degreeCourseService.createDegreeCourse(infoDegreeCourse, (err, result) => {
            if (result) {
                res.status(201).json(result)
            } else {
                res.status(400).json({ message: 'Error: Course wurde nicht erstellt.' })
            }
        })
    })
})

router.put('/:id', async (req, res) => {
    let infoDegreeCourseBody = req.body
    let reqHeader = req.headers['authorization']
    let parameterDegreeCourseID = req.params.id
    console.log(parameterDegreeCourseID)
    if (!reqHeader) {
        return res.status(401).json({ message: "Header is missing." })
    }
    authenticationService.isAuthorized(reqHeader, parameterDegreeCourseID, (err, user) => {
        if (err || user === false) {
            return res.status(401).json({ message: "Header is empty." })
        }
        degreeCourseService.updateDegreeCourse(parameterDegreeCourseID, infoDegreeCourseBody, (err, result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(400).json({ message: 'Error: Update nicht möglich.' })
            }
        })
    })
})

router.delete('/:_id', async (req, res) => {
    let delDegreeCourse = req.params._id
    degreeCourseService.deleteDegreeCourse(delDegreeCourse, (err, result) => {
        if (result) {
            res.status(204).json({ message: 'Course gelöscht.' })
        } else {
            res.status(404).json({ message: 'Course nicht gefunden.' })
        }
    })
})

module.exports = router