var express = require("express");
var router = express.Router();
var authenticationService = require("./AuthenticationService")

router.get("/", function (req, res, next) {
    console.log("Token")
    authenticationService.createSessionToken(req.headers.authorization, (err, token, user) =>{
        if (!token) {
            res.status(401).json({ Error: "Failed to create token: Authentication failed." })
        } else {
            // res.status(200).setHeader("Authorization", "Bearer " + token).json({ message: "Token created successfully." })
            res.status(200).header("Authorization", "Bearer " + token).json({ message: "Token created successfully." })
        }
    })
})

module.exports = router

