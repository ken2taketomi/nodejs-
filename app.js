const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); // body-parserを追加
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // body-parserの設定を追加

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'express_db'
});

// mysqlからデータを持ってくる
app.get('/', (req, res) => {
  // cssファイルの取得
  app.use(express.static('assets'));
  
  const sql = "select * from users";
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      users: result
    });
  });
});

app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      user: result
    });
  });
});

app.post('/update/:id', (req, res) => {
  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(
    sql, [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));