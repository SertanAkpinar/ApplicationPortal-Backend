const dcApp = require('./degreeCourseApplicationModel')
const userService = require('../publicUsers/UserService')
const dcService = require('../degreeCourses/degreeCourseService')
const { ObjectId } = require('mongodb')


async function findAllApplications(callback) {
    const apps = await dcApp.find()
    if (apps) {
        callback(null, apps)
    } else {
        callback(err, null)
    }
}

async function findAllApplicationsForUser(user, callback) {
    if (!user) {
        return callback("User nicht gefunden.", null)
    }
    try {
        const apps = await dcApp.findOne({ applicantUserID: user })
            .then((apps) => {
                if (apps) {
                    const mappedOutput = {
                        "id": apps._id,
                        "applicantUserID": apps.applicantUserID,
                        "degreeCourseID": apps.degreeCourseID,
                        "targetPeriodYear": apps.targetPeriodYear,
                        "targetPeriodShortName": apps.targetPeriodShortName
                    }
                    return callback(null, mappedOutput)
                } else {
                    return callback(err, null)
                }
            })
    } catch (err) {
        return callback('Keine gefunden.', null)
    }
}

async function findAllApplicationsForCourse(degreeCourse, callback) {
    if (!degreeCourse) {
        return callback("degreeCourse nicht gefunden.", null)
    }
try{
    const apps = await dcApp.findOne({ _id: degreeCourse })
        .then((apps) => {
            if (apps) {
                const mappedOutput = {
                    "id": apps._id,
                    "applicantUserID": apps.applicantUserID,
                    "degreeCourseID": apps.degreeCourseID,
                    "targetPeriodYear": apps.targetPeriodYear,
                    "targetPeriodShortName": apps.targetPeriodShortName
                }
                return callback(null, mappedOutput)
            } else {
                return callback(err, null)
            }
        })
    }catch(err){
        return callback('Error', null)
    }
}

async function findOneApplication(id, callback) {
    if (!id) {
        return callback('Fehlende ID', null)
    }
    const apps = await dcApp.findOne({ degreeCourseID: id.degreeCourseID })
        .then((apps) => {
            if (apps) {
                const mappedOutput = {
                    "id": apps._id,
                    "applicantUserID": apps.applicantUserID,
                    "degreeCourseID": apps.degreeCourseID,
                    "targetPeriodYear": apps.targetPeriodYear,
                    "targetPeriodShortName": apps.targetPeriodShortName
                }
                return callback(null, mappedOutput)
            } else {
                return callback(err, null)
            }
        })

}

async function createDegreeCourseApplication(/*user,*/ appInfo, callback) {
    if (
        appInfo.degreeCourseID === undefined ||
        appInfo.targetPeriodYear === undefined ||
        appInfo.targetPeriodShortName === undefined
    ) {
        return callback('Fehlerhafte Angaben', null)
    }
    const validPeriodShortNames = ['SoSe', 'WiSe'];

    if (!validPeriodShortNames.includes(appInfo.targetPeriodShortName)) {
        return callback('Ungültiger targetPeriodShortName', null);
    }

    try {
    const existApplication = await dcApp.findOne({
        degreeCourseID: appInfo.degreeCourseID,
        applicantUserID: appInfo.applicantUserID, //user,
        targetPeriodYear: appInfo.targetPeriodYear,
        targetPeriodShortName: appInfo.targetPeriodShortName
    });

    if (existApplication) {
        return callback('Bewerbung bereits erstellt', null);
    }

        const degreeCourseID = ObjectId(appInfo.degreeCourseID);
        dcService.findOneDegreeCourse(degreeCourseID, async (err, result) => {
            console.log(appInfo.degreeCourseID)
            if (err) {
                return callback('Keinen Kurs gefunden.', null);
            } else if (!result) {
                return callback('Kurs existiert nicht.', null);
            } else {
                const existApplication = await dcApp.findOne({
                    degreeCourseID: appInfo.degreeCourseID,
                    applicantUserID: appInfo.applicantUserID, //user,
                    targetPeriodYear: appInfo.targetPeriodYear,
                    targetPeriodShortName: appInfo.targetPeriodShortName
                });

                if (existApplication) {
                    return callback('Bewerbung bereits erstellt', null);
                }
                let createBody = {
                    "applicantUserID": appInfo.applicantUserID, //user,
                    "degreeCourseID": appInfo.degreeCourseID,
                    "targetPeriodYear": appInfo.targetPeriodYear,
                    "targetPeriodShortName": appInfo.targetPeriodShortName
                };

                const appCreate = await dcApp.create(createBody);
                if (appCreate) {
                    const mappedOutput = {
                        "id": appCreate._id,
                        "applicantUserID": appCreate.applicantUserID,
                        "degreeCourseID": appCreate.degreeCourseID,
                        "targetPeriodYear": appCreate.targetPeriodYear,
                        "targetPeriodShortName": appCreate.targetPeriodShortName
                    };
                    console.log(mappedOutput);
                    callback(null, mappedOutput);
                } else {
                    callback(err, null);
                }
            }
        })
    } catch (error) {
        return callback('Ungültige degreeCourseID', null);
    }
}

async function updateApplication(user, updateInfo, callback) {
    const filter = { _id: user }
    try {
        const appExist = await dcApp.findOne({ filter })
        if (!appExist) {
            return callback('Bewerbung gibt es nicht', null)
        }

        const update = {
            targetPeriodYear: updateInfo.targetPeriodYear,
            targetPeriodShortName: updateInfo.targetPeriodShortName
        }
        if (user) {
            const updateApp = dcApp.findByIdAndUpdate(filter, update, { new: true })
                .then((updateApp) => {
                    if (updateApp) {
                        const mappedOutput = {
                            "id": updateApp._id,
                            "applicantUserID": updateApp.applicantUserID,
                            "degreeCourseID": updateApp.degreeCourseID,
                            "targetPeriodYear": updateApp.targetPeriodYear,
                            "targetPeriodShortName": updateApp.targetPeriodShortName
                        }
                        callback(null, mappedOutput)
                    } else {
                        callback(null)
                    }
                })
        } else {
            return callback('ERROR', null)
        }
    } catch (err) {
        return callback('Error', null)
    }
}

async function deleteApplication(deleteApp, callback) {
    if (deleteApp) {
        let app = await dcApp.findByIdAndRemove({ _id: deleteApp })
            .then((app) => {
                if (app) {
                    callback(null, 'Application gelöscht.')
                } else {
                    callback(null)
                }
            })
    } else {
        return callback('Application nicht gefunden', null)
    }
}


module.exports = {
    findAllApplications, findAllApplicationsForCourse,
    findAllApplicationsForUser, findOneApplication,
    createDegreeCourseApplication, updateApplication,
    deleteApplication
}