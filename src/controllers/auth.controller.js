const User = require('../models/user.model')

//Function to register user/admin
exports.Register = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmpassword) {        //to check password and confirm password are equal
            return res.status(200).send("Confirm Password dont match")
        }
        if (req.body.password.length > 12) {
            return res.status(200).send("Password Length Greater than 12 characters")
        }
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send()
    }

}

//Function to login user/admin
exports.Login = async (req, res) => {
    try {
        const user = await User.getCredentials(req.body.email, req.body.password)   //call to verify credentials
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send({ error: "Auth Error" });
    }
}
