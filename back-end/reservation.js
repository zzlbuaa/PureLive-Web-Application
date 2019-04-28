const express = require("express");
const router = express.Router();
var sd = require("silly-datetime");
var con = require("./mysql_connect");

router.post("/newReservation", (req, res) => {
  var reserveDate = sd.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  var houseId = req.body.houseId;
  var userId = req.body.userId;
  var startDate = req.body.startDate;
  var leaveDate = req.body.leaveDate;

  let sql1 = `INSERT INTO Reservation (reserveDate, payment, houseId, userId, startDate, leaveDate, resScore, finished) VALUES
              ('${reserveDate}', 0, '${houseId}', '${userId}', '${startDate}', '${leaveDate}', 0, 0);`;

  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql1, function(err, result) {
      if (err) throw err;
      console.log(result);
      var reservationId = result.insertId;
      console.log(reservationId);
      let sql2 = `select reservationId, DATEDIFF(r.leaveDate, r.startDate) as dayscount, h.price as price
      from Reservation r join House h
      on r.houseId = h.house_id
      where reservationId = ${reservationId};`;
      connection.query(sql2, function(err, result) {
        if (err) throw err;
        var dayscount = result[0].dayscount;
        var price = result[0].price;
        var payment = dayscount * price;
        var reservationId = result[0].reservationId;
        let sql3 = `update Reservation set payment = ${payment} where reservationId = ${reservationId};
        insert into Trip (id_user, arriveDate, leaveDate, cityName) 
        select r.userId, r.startDate, r.leaveDate, h.city
        from Reservation r join House h
        on r.houseId = h.house_id
        where r.reservationId = ${reservationId};`;
        connection.query(sql3, function(err, result) {
          if (err) throw err;
        });
      });
      connection.release();
      res.send({ result : true });
    });
  });
});

router.delete("/:id", (req, res) => {
  var resId = req.params.id;
  let sql = `DELETE FROM Reservation WHERE reservationId = ${resId};`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result);
      connection.release();
      res.send({ result: true });
    });
  });
});

router.get("/isFinished/:reservationId", (req, res) => {
  var reservationId = req.params.reservationId;
  let sql = `SELECT finished
      FROM Reservation
      WHERE reservationId = ${reservationId}`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result[0]);
    });
  });
});

router.put("/comment", (req, res) => {
  //houseReview is the comment from the customer
  var reservationId = req.body.reservationId;
  var houseReview = req.body.houseReview;
  var resScore = req.body.resScore;
  let sql1 = `UPDATE Reservation SET houseReview = '${houseReview}', 
  resScore = ${resScore}, finished = 1 WHERE reservationId = ${reservationId}`;
  let sql2 = `SELECT houseId FROM Reservation WHERE reservationId = ${reservationId}`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql1, function(err, result) {
      if (err) throw err;
    });

    connection.query(sql2, function(err, result) {
      if (err) throw err;
      let houseId = result[0].houseId;
      let sql3 = `SELECT avgScore, finishedRes FROM House WHERE house_id = ${houseId}`;
      connection.query(sql3, function(err, result) {
        if (err) throw err;
        var avgScore = result[0].avgScore;
        var finishedRes = result[0].finishedRes;
        var newAvg = (avgScore * finishedRes + resScore) / (finishedRes + 1);
        finishedRes = finishedRes + 1;
        let sql4 = `UPDATE House SET avgScore = ${newAvg}, finishedRes = ${finishedRes} WHERE house_id = ${houseId}`;
        connection.query(sql4, function(err, result) {
          if (err) throw err;
          console.log(result);
        });
      });
    });

    connection.release();
    res.send({ result: true });
  });
});

router.get("/finished/:userId", (req, res) => {
  // console.log(req.query);
  var userId = req.params.userId;
  // console.log(req.body.city);
  let sql = `SELECT r.*, h.imgDir
    FROM Reservation r JOIN House h
    ON r.houseId = h.house_id 
    WHERE userId = ${userId} and finished = 1`;
  console.log(sql);
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      result.forEach(function(item){
        item.startDate = item.startDate.toISOString().slice(0,10);
        item.leaveDate = item.leaveDate.toISOString().slice(0,10);
      });
      res.status(200).send(result);
    });
  });
});

router.get("/unfinished/:userId", (req, res) => {
  // console.log(req.query);
  var userId = req.params.userId;
  // console.log(req.body.city);
  let sql = `SELECT r.*, h.imgDir
    FROM Reservation r JOIN House h
    ON r.houseId = h.house_id 
    WHERE userId = ${userId} and finished = 0`;
  console.log(sql);
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      result.forEach(function(item){
        item.startDate = item.startDate.toISOString().slice(0,10);
        item.leaveDate = item.leaveDate.toISOString().slice(0,10);
      });
      res.status(200).send(result);
    });
  });
});
module.exports = router;
