const { find, exists } = require('./UserModel');
const User = require('./UserModel');
const bcrypt = require("bcryptjs");


async function findAllUsers(callback) {
    const users = await User.find()
    if (users) {
        callback(null, users)
    } else {
        callback(err, null)
    }
}

async function findOneUser(searchedID, callback) {
    if (searchedID) {
        await User.findOne({ userID: searchedID })
            .then((users) => {
                if (users) {
                    callback(null, users)
                } else {
                    callback(null)
                }
            })
    } else {
        return callback(err, null)
    }
}

async function createUser(info, callback) {
    try {
        if (info.userID === undefined || info.firstName === undefined ||
            info.lastName === undefined || info.password === undefined) {
            return callback('Fehlende Angaben.', null)
        }

        const userExist = await User.findOne({ userID: info.userID })
        if (userExist) {
            return callback('UserID bereits vergeben', null)
        }

        if (info) {
            const userCreated = new User({
                userID: info.userID,
                firstName: info.firstName,
                lastName: info.lastName,
                password: info.password,
                isAdministrator: info.isAdministrator
            })

            await userCreated.save()
                .then((newUser) => {
                    if (newUser) {
                        callback(null, newUser)
                    } else {
                        callback(null)
                    }
                })
        }
    }
    catch (error) {
        return callback('Ein Fehler ist aufgetreten.', null)
    }
}

async function updateUser(infoID, updateInfo, callback) {
    const filter = { userID: infoID }
    try {
        const userExist = await User.findOne({ filter })
        if (!userExist) {
            return callback('User existiert nicht.', null)
        }

        if (updateInfo.password) {
            const salt = await bcrypt.genSalt()
            updateInfo.password = await bcrypt.hash(updateInfo.password, salt)
        }

        const update = {
            firstName: updateInfo.firstName, lastName: updateInfo.lastName,
            password: updateInfo.password
        }

        if (infoID) {
            await User.findOneAndUpdate(filter, update, { new: true })
                .then((updUser) => {
                    if (updUser) {
                        callback(null, updUser)
                    } else {
                        callback(null)
                    }
                })
        } else {
            return callback("ERROR", null)
        }
    } catch (error) {
        return callback('Ein Fehler ist aufegtreten.', null)
    }
}

async function deleteUser(infoParams, callback) {
    if (infoParams) {
        await User.findOneAndRemove({ userID: infoParams })
            .then((user) => {
                if (user) {
                    callback(null, "User gelöscht.")
                } else {
                    callback(null)
                }
            })
    } else {
        return callback("User nicht gefunden", null)
    }
}

async function findUserByID(searchedUserID, callback) {
    console.log("UserService: find user by ID " + searchedUserID)

    if (!searchedUserID) {
        callback("UserID is missing", null, null)
        return;
    } else {
        var query = User.findOne({ userID: searchedUserID });
        query.exec(function (err, user) {
            if (err) {
                console.log("Did not find user for userID: " + searchUserID);
                return callback("Did not find user for userID: " + searchUserID, null);
            }
            else {
                if (user) {
                    console.log(`Found userID: ${searchedUserID}`);
                    callback(null, user);
                }
                else {
                    if ("admin" == searchedUserID) {
                        console.log("Do not have admin account yet. Create it with default password")
                        var adminUser = new User();
                        adminUser.userID = "admin"
                        adminUser.password = "123"
                        adminUser.userName = "Default Administrator Account"
                        adminUser.isAdministrator = true

                        adminUser.save(function (err) {
                            if (err) {
                                console.log("Could not create default admin account: " + err);
                                callback("Could not login to admin account", null);
                            }
                            else {
                                callback(null, adminUser);
                            }
                        });
                    }
                    else {
                        console.log("Could not find user for user ID:" + searchUserID);
                        callback(null, user);
                    }
                }
            }
        });
    }
}

async function standardAdmin() {
    const existingAdmin = await User.findOne({ userID: "admin" })
    if (!existingAdmin) {
        const startAdmin = new User({
            userID: "admin",
            firstName: "Sertan",
            lastName: "Akpinar",
            password: "123",
            isAdministrator: true
        })
        await startAdmin.save()
    }
}

module.exports = {
    createUser, findOneUser, findAllUsers,
    updateUser, deleteUser, findUserByID, standardAdmin
}