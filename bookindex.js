let nodemailer = require("nodemailer");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const { get, request } = require("http");

let app = express();
app.use(express.static("public"));
//started the server on port 4000
app.listen(5000, () => {
    console.log("Server started ar port 5000..");
});

//database connection
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Vijaya@11",
    database: "bookstore",
});

//test the connection
connection.connect(function (err) {
    if (err) throw err;
    return console.log("Connected to DB...");
});
const staticfile = path.join(__dirname, "/assets");
app.use(express.static(staticfile));

//writing a middleware to setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//render add page - user_add
// app.get('/', (req, res) => {
//    res.render("checkout", {
//    title: "Add Customer"
//     });
//  });

app.get("/", (req, res) => {
    res.render("index", {});
});

//after user clicks on save button - insert the record in table
app.post("/save", (req, res) => {
    let data = { bookid: req.body.bookid, bookname: req.body.bookname, catagory: req.body.catagory, author: req.body.author, price: req.body.price };
    let sql = "INSERT INTO bookmaster SET ?";
    let qry = connection.query(sql, data, (err, rows) => {
        if (err) throw err;
        res.redirect("/");
    });
});
app.get("/admin", (req, res) => {
    let sql = "SELECT * FROM bookmaster";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("admin", {
            title: "Book Details",
            book: rows,
        });
    });
});
app.get("/addbook", (req, res) => {
    res.render("addbook", {});
});
app.get("/products", (req, res) => {
    res.render("products", {});
});

app.get("/product-details", (req, res) => {
    res.render("product-details", {});
});

app.get("/checkout", (req, res) => {
    let sql = "SELECT * FROM bookmaster";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("checkout", {
            title: "checkout",
            user: rows,
        });
    });
});

app.get("/checkout", (req, res) => {
    res.render("checkout", {});
});
app.get("/about", (req, res) => {
    res.render("about", {});
});
app.get("/blog", (req, res) => {
    res.render("blog", {});
});

app.get("/blog-post", (req, res) => {
    res.render("blog-post", {});
});

app.get("/testimonials", (req, res) => {
    res.render("testimonials", {});
});

app.get("/terms", (req, res) => {
    res.render("terms", {});
});

// app.get("/", (req, res) => {
//     res.render("index", {});
// });

app.get("/login", (req, res) => {
    res.render("login", {});
});
app.get("/about", (req, res) => {
    res.render("about", {});
});

//after the user clicks on edit button
app.get("/bookuser_edit/:bookid", (req, res) => {
    const bookId = req.params.bookid;
    let sql = "SELECT * FROM bookmaster WHERE bookid=?";
    let qry = connection.query(sql, [bookId], (err, rows) => {
        if (err) throw err;
        res.render("bookuser_edit", {
            title: "Edit Books",
            book: rows[0],
        });
    });
});

// //after user clicks on save button of user edit page - update the record

app.post("/bookuser_edit", (req, res) => {
    let sql = "UPDATE bookmaster SET price = ?, author = ?, catagory =?, bookname =? WHERE bookid = ?";
    let qry = connection.query(sql, [req.body.price, req.body.author, req.body.catagory, req.body.bookname, req.body.bookid], (err, rows) => {
        if (err) throw err;
        res.redirect("/admin");
    });
});

//after the user clicks on delete button
app.get("/delete/:bookid", (req, res) => {
    let sql = "DELETE FROM bookmaster WHERE bookid = ?";
    let qry = connection.query(sql, [req.params.bookid], (err, rows) => {
        if (err) throw err;
        res.redirect("/admin");
    });
});

//after user clicks on save button - insert the record in table
app.post("/add", (req, res) => {
    let data = {
        userName: req.body.userName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        payment: req.body.payment,
        bookid: req.body.bookid,
        quantity: req.body.quantity,
    };
    let sql = "INSERT INTO users SET ?";
    let qry = connection.query(sql, data, (err, rows) => {
        if (err) throw err;
        res.redirect("/checkout");
    });
});
app.get("/user_detail", (req, res) => {
    let sql = "SELECT * FROM users";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_detail", {
            title: "User Details",
            user: rows,
        });
    });
});

//after the user clicks on edit button
app.get("/user_edit/:uesrId", (req, res) => {
    const userid = req.params.uesrId;
    let sql = "SELECT * FROM users WHERE uesrId=?";
    let qry = connection.query(sql, [userid], (err, rows) => {
        if (err) throw err;
        res.render("user_edit", {
            title: "Edit User",
            user: rows[0],
        });
    });
});

// //after user clicks on save button of user edit page - update the record

app.post("/user_edit", (req, res) => {
    let sql = "UPDATE users SET quantity = ?, bookid = ?,payment =?, state =?,city =?,address =?, phone = ?, email=?, userName =? WHERE uesrId = ?";
    let qry = connection.query(
        sql,
        [
            req.body.quantity,
            req.body.bookid,
            req.body.payment,
            req.body.state,
            req.body.city,
            req.body.address,
            req.body.phone,
            req.body.email,
            req.body.userName,
            req.body.userId,
        ],
        (err, rows) => {
            if (err) throw err;
            res.redirect("/user_detail");
        }
    );
});

//after the user clicks on delete button
app.get("/remove/:uesrId", (req, res) => {
    let sql = "DELETE FROM users WHERE uesrId = ?";
    let qry = connection.query(sql, [req.params.uesrId], (err, rows) => {
        if (err) throw err;
        res.redirect("/user_detail");
    });
});

//mail code.
app.post("/mailpage", (req, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vijayatest11@gmail.com",
            pass: "Vijaya@11",
        },
    });
    let mailOptions = {
        from: "vijayatest11@gmail.com",
        to: "vijayachaudhari08@gmail.com",
        subject: req.subject,
        text: req.message,
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error " + err.message);
            return;
        }
        console.log("Message sent... " + info.response);
        res.redirect("/contact");
    });
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
