var userService = require('../publicUsers/UserService')
var jwt = require("jsonwebtoken")
var config = require("config")

function createSessionToken(props, callback) {
    console.log("AuthenticationService: create Token")
    if (!props) {
        console.log("Error: kein JSON Content")
        callback("JSON-Body missing", null, null)
        return
    }

    const base64Credentials = props.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [userID, password] = credentials.split(':');

    userService.findUserByID(userID, (error, user) => {
        if (user) {
            console.log("Found user, check the password")
            user.comparePassword(password, (err, isMatch) => {

                if (err) {
                    console.log("Password is invalid");
                    return callback(err, null, null);
                }
                else {
                    if (isMatch) {
                        console.log("Password is correct. Create token.");

                        var expirationTime = config.get("session.timeout");
                        var privateKey = config.get("session.tokenKey");
                        var token = jwt.sign({ user: user.userID, isAdministrator: user.isAdministrator },
                            privateKey, { expiresIn: expirationTime, algorithm: "HS256" });

                        console.log(token + user)
                        return callback(null, token, user);
                    }
                    else {
                        console.log("Password or user ID are invalid");
                        return callback(err, null, null);
                    }
                }
            })
        }
        else {
            console.log("Session Services: Did not find user for user ID: " + props.userID);
            callback("Did not find user", null);
        }
    })
}

function isAuthorized(user, chekingUserID, callback) {
    if (typeof user !== undefined) {
        const token = user.split(' ')[1]
        jwt.verify(token, config.get('session.tokenKey'), { algorithm: "HS256" }, (err, user) => {
            if (err) {
                return callback(err, null)
            } else {
                const payloadAdmin = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
                console.log(payloadAdmin);
                if (payloadAdmin.isAdministrator) {
                    return callback(null, true)
                }

                if (payloadAdmin.user == chekingUserID) {
                    return callback(null, true)
                }
                return callback(null, false)
            }
        })
    }
}

function isUserAuthorized(user, chekingUserID, callback) {
    if (typeof user !== undefined) {
        const token = user.split(' ')[1]
        jwt.verify(token, config.get('session.tokenKey'), { algorithm: "HS256" }, (err, user) => {
            if (err) {
                return callback(err, null)
            } else {
                const payloadAdmin = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

                if (!payloadAdmin.isAdministrator) {
                    return callback(null, true)
                }

                if (payloadAdmin.user == chekingUserID) {
                    return callback(null, true)
                }
                return callback(null, false)
            }
        })
    }
}

function getUserIDFromToken(loginCredentials) {
    if (!loginCredentials) {
        return callback("Crucial information missing.")
    }
    const token = loginCredentials.split(" ")[1]
    const payloadInfo = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const username = payloadInfo.user
    // console.log(credentials)
    return username
}



module.exports = {
    createSessionToken,
    isAuthorized,
    isUserAuthorized,
    getUserIDFromToken
}