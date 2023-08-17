var mongoose = require("mongoose")

const degreeCourseApplicationSchema = new mongoose.Schema({
    applicantUserID: {type: String, required: true},
    degreeCourseID: {type: String, required: true},
    targetPeriodYear: {type: String, required: true},
    targetPeriodShortName: {type: String, required: true}
})

const degreeCourseApplication = mongoose.model("degreeCourseApplication", degreeCourseApplicationSchema)
module.exports = degreeCourseApplication