const User = require('../models/user.model')

//function to check valid operation during update
const isValidOperation = (updates) => {
    if (updates.length == 0) {
        return false;
    }
    const allowedUpdates = ["firstName", "middleName", "lastName", "email", "role", "department"];
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    return isValid
}
// function to check if parameters are valid during viewing profile
const isValidParameter = (params) => {
    const allowedViews = ["firstName", "middleName", "lastName", "email", "role", "department"]
    const isValid = params.every((param) => allowedViews.includes(param))
    return isValid
}
//user role value
const roleValue = {
    "ADMIN": 2,
    "USER": 1
}

//function to add user by any other user/Admin
exports.addUser = async (req, res) => {
    try {
        if (roleValue[req.user.role] < roleValue[req.body.role]) {
            return res.status(400).send({ "msg": `${req.user.role} cant add ${req.body.role}` })
        }
        return res.redirect(307, "/users/register");   //Temporary redirect to register api;
    }
    catch (e) {
        res.status(500).send();
    }
}

//function to update himself
exports.updateMe = async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOper = isValidOperation(updates)
    if (!isValidOper) {
        return res.status(400).send({ "error": "invalid Request" })
    }
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
}
//function to user user by any other user/Admin
exports.updateUsers = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user) {
        return res.status(400).send({ msg: "user Not found" })
    }

    if (roleValue[user.role] > roleValue[req.user.role]) {   //to check the authority
        return res.status(400).send({ msg: `${req.user.role} cannot update ${user.role}` })
    }

    const updates = Object.keys(req.body);
    const isValidOper = isValidOperation(updates)  //to check the operation is valid or not
    if (!isValidOper) {
        return res.status(400).send({ "error": "invalid Request" })
    }

    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }

}
//function to view own profile
exports.viewMe = async (req, res) => {
    try {
        const params = req.query.feilds
        const user = await User.findById(req.user._id)

        user.password = undefined

        if (!params) {
            return res.status(200).send(user)
        }

        const isValidParam = isValidParameter(params)
        if (!isValidParam) {
            return res.status(400).send({ "msg": "Invalid Field" })
        }

        let viewUser = {};
        params.forEach((param) => {
            viewUser[param] = user[param]
        })

        res.send(viewUser)
    }
    catch (e) {
        res.status(500).send(e)
    }
}
//function to view other user/admin profile
exports.viewUsers = async (req, res) => {
    try {
        const id = req.params.id
        const params = req.query.feilds
        const user = await User.findById(id)

        if (roleValue[user.role] > roleValue[req.user.role]) {
            return res.status(400).send({ msg: `${req.user.role} cannot view ${user.role}` })
        }

        user.password = undefined

        if (!params) {
            return res.status(200).send(user)
        }

        const isValidParam = isValidParameter(params)
        if (!isValidParam) {
            return res.status(400).send({ "msg": "Invalid Field" })
        }

        let viewUser = {};
        params.forEach((param) => {
            viewUser[param] = user[param]
        })

        res.send(viewUser)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

