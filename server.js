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
        const insertSql = `INSERT INTO user (nama, kelas) VALUES (?, ?)`;
        db.query(insertSql, [nama, kelas], (err, result) => {
            if (err) throw err;
            console.log("Data berhasil ditambahkan");
            res.redirect("/");
        });
    });

    // Route untuk menampilkan form edit data berdasarkan id
    app.get("/edit/:id", (req, res) => {
        const id = req.params.id;
        const selectSql = `SELECT * FROM user WHERE id = ?`;
        db.query(selectSql, [id], (err, result) => {
            if (err) throw err;
            const user = JSON.parse(JSON.stringify(result));
            res.render("edit", { user: user[0], title: "EDIT DATA" });
        });
    });

    // Route untuk mengupdate data berdasarkan id
    app.post("/edit/:id", (req, res) => {
        const id = req.params.id;
        const nama = req.body.nama;
        const kelas = req.body.kelas;
        const updateSql = `UPDATE user SET nama = ?, kelas = ? WHERE id = ?`;
        db.query(updateSql, [nama, kelas, id], (err, result) => {
            if (err) throw err;
            console.log("Data berhasil diupdate");
            res.redirect("/");
        });
    });

    // Route untuk menghapus data berdasarkan id
    app.get("/hapus/:id", (req, res) => {
        const id = req.params.id;
        const deleteSql = `DELETE FROM user WHERE id = ?`;
        db.query(deleteSql, [id], (err, result) => {
            if (err) throw err;
            console.log("Data berhasil dihapus");
            res.redirect("/");
        });
    });
});
