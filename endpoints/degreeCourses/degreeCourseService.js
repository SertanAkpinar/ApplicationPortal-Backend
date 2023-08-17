const degreeCourse = require('./degreeCourseModel')
const { find, exists } = require('./degreeCourseModel')


async function findAllDegreeCourses(callback) {
    const courses = await degreeCourse.find()
    if (courses) {
        callback(null, courses)
    } else {
        callback(err, null)
    }
}

async function findOneDegreeCourse(searchedCourseID, callback) {
    if (searchedCourseID) {
        let courses = await degreeCourse.findOne({ _id: searchedCourseID })
            .then((courses) => {
                if (courses) {
                    const mappedOutput = {
                        "id": courses._id,
                        "name": courses.name,
                        "shortName": courses.shortName,
                        "universityName": courses.universityName,
                        "universityShortName": courses.universityShortName,
                        "departmentName": courses.departmentName,
                        "departmentShortName": courses.departmentShortName
                    }
                    return callback(null, mappedOutput)
                } else {
                    return callback(null)
                }
            })
    } else {
        return callback('Keinen Course gefunden.', null)
    }
}

async function createDegreeCourse(info, callback) {
    try {
        if (info.universityName === undefined ||
            info.universityShortName === undefined ||
            info.departmentName === undefined ||
            info.departmentShortName === undefined ||
            info.name === undefined ||
            info.shortName === undefined) {
            return callback('Fehlende Angaben', null)
        }

        const courseExists = await degreeCourse.findOne({ name: info.name })
        if (courseExists) {
            return callback('DegreeCourse bereits erstellt.', null)
        }

        if (info) {
            const courseCreated = new degreeCourse({
                universityName: info.universityName,
                universityShortName: info.universityShortName,
                departmentName: info.departmentName,
                departmentShortName: info.departmentShortName,
                name: info.name,
                shortName: info.shortName
            })

            const newDegreeCourse = await courseCreated.save()
                .then((newDegreeCourse) => {
                    if (newDegreeCourse) {
                        const mappedOutput = {
                            "id": newDegreeCourse._id,
                            "name": newDegreeCourse.name,
                            "shortName": newDegreeCourse.shortName,
                            "universityName": newDegreeCourse.universityName,
                            "universityShortName": newDegreeCourse.universityShortName,
                            "departmentName": newDegreeCourse.departmentName,
                            "departmentShortName": newDegreeCourse.departmentShortName
                        }
                        callback(null, mappedOutput)
                    } else {
                        callback(null)
                    }
                })
        }
    } catch (error) { }
}

async function updateDegreeCourse(infoID, updateInfo, callback) {
    const filter = { _id: infoID }
    console.log(infoID)
    try {
        const courseExists = await degreeCourse.findOne({ filter })
        if (!courseExists) {
            return callback('DegreeCourse existiert nicht.', null)
        }

        const update = {
            universityName: updateInfo.universityName,
            universityShortName: updateInfo.universityShortName,
            departmentName: updateInfo.departmentName,
            departmentShortName: updateInfo.departmentShortName,
            name: updateInfo.name,
            shortName: updateInfo.shortName
        }

        if (infoID) {
            const updDegreeCourse = degreeCourse.findByIdAndUpdate(filter, update, { new: true })
                .then((updDegreeCourse) => {
                    if (updDegreeCourse) {
                        const mappedOutput = {
                            "id": updDegreeCourse._id,
                            "name": updDegreeCourse.name,
                            "shortName": updDegreeCourse.shortName,
                            "universityName": updDegreeCourse.universityName,
                            "universityShortName": updDegreeCourse.universityShortName,
                            "departmentName": updDegreeCourse.departmentName,
                            "departmentShortName": updDegreeCourse.departmentShortName
                        }
                        callback(null, mappedOutput)
                    } else {
                        callback(null)
                    }
                })
        } else {
            return callback('ERROR', null)
        }
    } catch (error) { }
}

async function deleteDegreeCourse(infoParams, callback) {
    if (infoParams) {
        let course = await degreeCourse.findByIdAndRemove({ _id: infoParams })
            .then((course) => {
                if (course) {
                    callback(null, 'Course gelöscht.')
                } else {
                    callback(null)
                }
            })
    } else {
        return callback('Course nicht gefunden', null)
    }
}

module.exports = {
    findAllDegreeCourses,
    findOneDegreeCourse,
    createDegreeCourse,
    updateDegreeCourse,
    deleteDegreeCourse
}