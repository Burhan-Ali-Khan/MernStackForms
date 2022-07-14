const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registration", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connection Successfull`)
}).catch((e) => {
    console.log(`Connection Not Successfull`)
})