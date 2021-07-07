const mongoose = require("mongoose")

//Database Connection
try {

    mongoose.connect("mongodb://127.0.0.1:27017/proelium", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database 🌱"));
} catch (err) {
    console.log(err);
    process.exit(1);
}