const express = require("express");
const router = express.Router();
const Joi = require("joi");

var con = require("./mysql_connect");

router.post("/registerUsers", (req, res) => {
  let gender = req.body.gender;
  let age = req.body.age;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let password = req.body.password;
  let user_name = req.body.user_name;
  let user_phone = req.body.user_phone;
  let user_email = req.body.user_email;
  let tag = req.body.tag;
  let sql1 = "SELECT user_name FROM User WHERE user_name='" + user_name + "';";
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql1, function(err, result) {
      if (err) throw err;
      if (result.length == 0) {
        connection.release();
        res.send({ result: true });
        let sql2 = `INSERT INTO User (gender, age, firstname, lastname, password, user_name, user_phone, user_email, tag) VALUES
                  ('${gender}', '${age}', '${firstname}', '${lastname}', '${password}', '${user_name}', '${user_phone}', '${user_email}', '${tag}');`;
        connection.query(sql2, function(err, result) {
          if (err) throw err;
        });
      } else {
        connection.release();
        res.send({ result: false });
      }
    });
  });
});

router.get("/checkUsername/:username", (req, res) => {
  var username = req.params.username;
  let sql = "SELECT user_name FROM User WHERE user_name='" + username + "';";
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      if (result.length == 0) {
        connection.release();
        res.send({ result: true });
      } else {
        connection.release();
        res.send({ result: false });
      }
    });
  });
});

router.post("/login", (req, res) => {
  var login_username = req.body.user_name;
  var login_password = req.body.password;
  let sql = `SELECT user_id, firstname, lastname, user_phone, user_email FROM User WHERE user_name = '${login_username}' AND password = '${login_password}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      if (result.length == 0) {
        connection.release();
        console.log(result);
        res.send({ confirmDetails: false });
      } else {
        connection.release();
        console.log("login success");
        res.send({
          confirmDetails: true,
          user_id: result[0].user_id,
          firstname: result[0].firstname,
          lastname: result[0].lastname,
          user_phone: result[0].user_phone,
          user_email: result[0].user_email
        });
      }
    });
  });
});

router.post("/update", (req, res) => {
  con.connection.getConnection(function(err, connection) {
    if (err) {
      res.send({ result: false });
    } else {
      var user_id = req.body.user_id;

      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (key === "user_id") {
            continue;
          }
          var sql = "";
          if (typeof req.body[key] === "string") {
            sql = `UPDATE User SET ${key} = '${
              req.body[key]
            }' where user_id = ${user_id};`;
          } else {
            sql = `UPDATE User SET ${key} = ${
              req.body[key]
            } where user_id = ${user_id};`;
          }

          console.log(sql);
          connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
          });

          console.log(key);
          console.log(req.body[key]);
        }
      }
      connection.release();
    }
  });
  res.send({ result: true });
});

function validateUser(user) {
  const schema = {
    firstname: Joi.string()
      .min(3)
      .required(),
    lastname: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = router;
