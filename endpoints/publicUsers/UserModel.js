var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");

const UserSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isAdministrator: { type: Boolean, default: false},
   },   {timestamps: true}
);

UserSchema.pre("save", function(next){
    var user = this;
    bcrypt.hash(user.password, 10).then((hashedPassword)=> {
        user.password = hashedPassword;
        next();
    })
})

UserSchema.methods.comparePassword = function (candidatePassword, next){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err)
            return next(err);
        else
            next(null, isMatch)
    })
}

const User = mongoose.model("User", UserSchema)
module.exports = User;