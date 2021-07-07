const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")
//Api endpoint to register users/admin
router.post('/register', authController.Register)

//Api endpoint to login users/admin
router.post('/login', authController.Login)

//Api endpoint to Add user
router.post("/add-user", auth, userController.addUser)

//Api endpoint to update himself
router.patch('/update-me', auth, userController.updateMe)

//Api endpoint to update other users/admin 
router.patch("/update-users/:id", auth, userController.updateUsers)

//Api endpoint to view own profile
router.get("/view-me", auth, userController.viewMe)

//Api endpoint to view profile of other users/Admin
router.get("/view-users/:id", auth, userController.viewUsers)


module.exports = router