var mongoose = require("mongoose")

const degreeCourseSchema = new mongoose.Schema({
    // degreeCourseID: { type: String, required: true, unique: true},
    universityName: { type: String, required: true },
    universityShortName: { type: String, required: true },
    departmentName: { type: String, required: true },
    departmentShortName: { type: String, required: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true }
}, { timestamps: true }
)

const degreeCourse = mongoose.model("degreeCourse", degreeCourseSchema)
module.exports = degreeCourse