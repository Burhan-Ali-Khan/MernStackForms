const express = require("express");
const path = require("path");
const app = express();
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/registers");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword
            })

            // Password hash
            // middleware 


            const registered = await registerEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("passwords are not matching");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});
app.get("/login", (req, res) => {
    res.render("login");
})

// login check 

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(`${email} and password is ${password}`);
        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("email or password is not matching");
        }

    } catch (error) {
        res.status(400).send("invalid email or password");
    }
})

// const bycrypt = require("bcryptjs");

// const securePassword = async (password) => {

//     const passwordHash = await bycrypt.hash(password, 10);
//     console.log(passwordHash);
//     const passwormatch = await bycrypt.compare(password, passwordHash);
//     console.log(passwormatch);
// }

// securePassword("thapa@123");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})