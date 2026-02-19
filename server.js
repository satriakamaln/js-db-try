const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
    host: "localhost",
    database: "school",
    user: "root",
    password: ""
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database");

    app.get("/", (req, res) => {
        const sql = "SELECT * FROM user";
        db.query(sql, (err, result) => {
            const users = JSON.parse(JSON.stringify(result));
            res.render("index", { users: users, title: "DAFTAR MURID KELAS" });
        });
    });

    app.post("/tambah", (req, res) => {
        const nama = req.body.nama;
        const kelas = req.body.kelas;
        const insertSql = `INSERT INTO user (nama, kelas) VALUES ('${nama}', '${kelas}')`;
        db.query(insertSql, (err, result) => {
            if (err) throw err;
            console.log("Data berhasil ditambahkan");
            res.redirect("/");
        });
    });
});
