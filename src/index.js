const express = require("express");
require("./db/mongoose")
const User = require("./models/user.model")
const userRouter = require("./routes/user");
const cors = require("cors");
require("dotenv").config()

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.use(cors({
    origin: "http://localhost:" + port,
    methods: ["GET", "POST", "PATCH"]
}))

app.use("/users", userRouter)


app.listen(port, () => {
    console.log("Server Running at port " + port);
})
