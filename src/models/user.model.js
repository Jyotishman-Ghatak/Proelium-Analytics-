const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//User Schema 
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        department: {
            type: String
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            required: true
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
    },
    { timestamps: true }
);
//Function to generate JWT Token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
//Function to check Credentials
userSchema.statics.getCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ "error": "Unable to login" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error({ "error": "Unable to login" });
    }
    return user;

}
//Deleting password and tokens from viewing
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password

    return userObject
}
//Function to hash password
userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})
const User = mongoose.model("User", userSchema)
module.exports = User