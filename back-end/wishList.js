const express = require("express");
const router = express.Router();
var sd = require("silly-datetime");
var con = require("./mysql_connect");
var distance = require("compute-cosine-distance");

router.get("/travel/:userId", (req, res) => {
  var userId = req.params.userId;
  var time = sd.format(new Date(), "YYYY-MM-DD");
  let sql = `SELECT t.tripId AS trip_id, c.cityName, c.description, t.arriveDate, t.leaveDate
        FROM Trip t join City c
        ON t.cityName = c.cityName
        WHERE t.id_user = ${userId} AND '${time}' <= t.arriveDate`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      result.forEach(function(item) {
        item.arriveDate = item.arriveDate.toISOString().slice(0, 10);
        item.leaveDate = item.leaveDate.toISOString().slice(0, 10);
      });
      res.send(result);
    });
  });
});

router.get("/travel/friend/:userId", (req, res) => {
  var userId = req.params.userId;
  var time = sd.format(new Date(), "YYYY-MM-DD");
  let sql = `SELECT t.id_user, t.arriveDate, t.leaveDate, t.cityName, u.age, u.gender, u.tag
   FROM Trip t join User u
   on t.id_user = u.user_id
   WHERE t.id_user = ${userId} AND '${time}' <= t.arriveDate`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      result.forEach(function(item) {
        item.arriveDate = item.arriveDate.toISOString().slice(0, 10);
        item.leaveDate = item.leaveDate.toISOString().slice(0, 10);
      });
      const userId = result[0].id_user;
      let userArriveDate = result[0].arriveDate;
      let userLeaveDate = result[0].leaveDate;
      let userCityName = result[0].cityName;
      const userAge = result[0].age;
      const userGender = result[0].gender;
      const userTag = result[0].tag;
      let friendsList = [];
      var time = sd.format(new Date(), "YYYY-MM-DD");
      let sql1 = `select id_user, arriveDate, leaveDate from Trip 
      where ('${time}' <= arriveDate and arriveDate >= '${userArriveDate}' and arriveDate <= '${userLeaveDate}' and cityName = '${userCityName}' and id_user <> ${userId})
      or
      ('${time}' <= arriveDate and leaveDate >= '${userArriveDate}' and leaveDate <= '${userLeaveDate}' and cityName = '${userCityName}' and id_user <> ${userId})`;
      connection.query(sql1, function(err, result) {
        if (err) throw err;
        if (result.length < 1) res.send(result);
        else {
          Promise.all(
            result.map(function(item) {
              let sql2 = `select firstname, lastname, gender, age, tag, user_phone, user_email from User where user_id = ${
                item.id_user
              };`;
              let sql3 = `select AVG(h.price) AS average_price
            from Reservation r join House h
            on r.houseId = h.house_id
            where r.userId = ${item.id_user};`;
              var promise = new Promise(function(resolve, reject) {
                connection.query(sql2, function(err, result) {
                  if (err) throw err;
                  item.firstname = result[0].firstname;
                  item.lastname = result[0].lastname;
                  item.gender = result[0].gender;
                  item.age = result[0].age;
                  item.tag = result[0].tag;
                  item.phone = result[0].user_phone;
                  item.email = result[0].user_email;
                });

                connection.query(sql3, function(err, result) {
                  if (err) throw err;
                  if (result[0].average_price == null) item.avgPrice = 0;
                  else item.avgPrice = result[0].average_price;
                  resolve(item);
                });
              });
              return promise.then(function(item) {
                item.arriveDate = item.arriveDate.toISOString().slice(0, 10);
                item.leaveDate = item.leaveDate.toISOString().slice(0, 10);
                friendsList.push(item);
              });
            })
          ).then(function() {
            let sql4 = `select AVG(h.price) AS average_price
            from Reservation r join House h
            on r.houseId = h.house_id
            where r.userId = ${userId}`;
            connection.query(sql4, function(err, result) {
              if (err) throw err;
              connection.release();
              const userAvgPrice = result[0].average_price;
              friendsList.forEach(function(item) {
                var vectorA = [];
                var vectorB = [];
                var gender = item.gender;
                var age = item.age;
                var tag = item.tag;
                var avgPrice = item.avgPrice;
                if (tag === 0 && userTag === 0 && gender !== userGender) {
                  vectorA.push(0);
                  vectorB.push(0);
                } else {
                  vectorA.push(100);
                  vectorB.push(0);
                }
                vectorA.push(age);
                vectorB.push(userAge);
                vectorA.push(avgPrice);
                vectorB.push(userAvgPrice);
                var similarity = 1 / (distance(vectorA, vectorB) + 0.000001);
                similarity = similarity / 7;
                if (similarity > 1) {
                  similarity = 0.90;
                }
                similarity *= 100;

                item.similarity = similarity.toFixed(1).toString() + "%";
              });
              function compare(a, b) {
                let compare = 0;
                if (a.similarity > b.similarity) {
                  compare = -1;
                } else {
                  compare = 1;
                }
                return compare;
              }
              console.log(friendsList.sort(compare));
              var num_recommends = Math.min(friendsList.length, 3);
              res.send(friendsList.slice(0, num_recommends));
            });
          });
        }
      });
    });
  });
});

module.exports = router;
