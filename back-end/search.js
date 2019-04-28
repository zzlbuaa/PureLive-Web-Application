const express = require("express");
const router = express.Router();

var con = require("./mysql_connect");

router.get("/info/house", (req, res) => {
  console.log(req.query);
  var city = req.query.city;
  // console.log(req.body.city);
  let sql = `SELECT *
    FROM House
    WHERE availableDates <> '1970-01-01' and city = '${city}' `;
  console.log(sql);
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.status(200).send(result);
    });
  });
});

router.get("/info/advhouse", (req, res) => {
  var city = req.query.cityname;
  let sql = `SELECT *
    FROM House
    WHERE availableDates <> '1970-01-01' and city = '${city}' `;
  console.log(sql);
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.status(200).send(result);
    });
  });
});

router.get("/info/countHouse/:cityname", (req, res) => {
  var city = req.params.cityname;
  let sql = `SELECT COUNT(*) AS countHouse
      FROM House
      GROUP BY city
      having city = '${city}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result[0]);
    });
  });
});

router.get("/info/city", (req, res) => {
  var city = req.query.cityname;
  console.log(city);
  let sql = `SELECT h.price, h.address, h.city, u.firstname, u.lastname
    FROM House h JOIN User u
    ON h.user_id = u.user_id
    WHERE h.city = '${city}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.status(200).send(result);
    });
  });
});

router.get("/info/availabledate/:date", (req, res) => {
  var date = req.params.date;
  let sql = `SELECT h.price, h.address, h.city, u.firstname, u.lastname
      FROM House h JOIN User u
      ON h.user_id = u.user_id
      WHERE h.availableDates = '${date}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result);
    });
  });
});

const house_tags = ["Luxury/Exclusive Stay", 
                    "Downtown", 
                    "Free Parking", 
                    "Comfy Cozy Space", 
                    "Quiet Room", 
                    "Easy Transportation", 
                    "Fantastic View"];

router.post("/info", (req, res) => {
  console.log(req.query);
  var city = req.body.city;
  var user_id = req.body.user_id;
  var startDate = req.body.startDate;
  var leaveDate = req.body.leaveDate;
  var price_filter = req.body.price;
  var score_filter = req.body.score;
  // console.log(req.body.city);
  let sql = `SELECT DISTINCT House.*
    FROM House left join Reservation
    ON House.house_id = Reservation.houseId 
    WHERE availableDates <> '1970-01-01' and availableDates <= '${startDate}'
    and city = '${city}' and (ifnull(startDate, '1970-01-01') >= '${leaveDate}' or ifnull(leaveDate, '1970-01-01') <= '${startDate}')`

  let default_sql = 
  `select AVG(h.price) AS average_price, AVG(h.avgScore) AS average_score
    from Reservation r join House h
    on r.houseId = h.house_id
    where r.userId = ${user_id};`

  let housetag_sql = 
  `SELECT count(*) as cnt
  FROM Reservation r join House h 
  on r.houseId = h.house_id
  where r.userId = ${user_id}
  group by h.tag
  order by cnt desc
  limit 1`

  let hasFilter = true;
  let loggedIn = user_id !== undefined;

  console.log(default_sql);

  if (price_filter !== undefined) {
    sql += ` ORDER BY price ${price_filter};`;
  } else if (score_filter !== undefined) {
    sql += ` ORDER BY avgScore ${score_filter};`;
  } else {
    hasFilter = false;
    sql += ';';
  }

  con.connection.getConnection(function(err, connection) {
    if (err) throw err;

    var average_price, average_score;
    var favorite_tag;
    console.log('hasFilter:');
    console.log(hasFilter);

    if (hasFilter) {
      connection.query(sql, function(err, result) {
        if (err) throw err;
        console.log(sql);
        connection.release();

        result.forEach(function(item){
          item.availableDates = item.availableDates.toISOString().slice(0,10);
        });
        res.status(200).send(result);
      });
    } else if (loggedIn) {
      connection.query(default_sql, function(err, result) {
        if (err) throw err;
        average_price = result[0].average_price;
        average_score = result[0].average_score;
        console.log("avgs1:");
        console.log("hasFilter:");
        console.log(hasFilter);

        console.log(sql);
      });

      connection.query(housetag_sql, function(err, result) {
        if (err) throw err;
        if (result.length >= 1) {
          favorite_tag = result[0].cnt;
        }
        console.log("fav tag");
        console.log(favorite_tag);
      }); 

      connection.query(sql, function(err, result) {
        if (err) throw err;
        console.log(typeof(result));
        console.log(result[0]);
        connection.release();
        console.log(result);
        var max_finished_res = result.reduce((max, p) => p.finishedRes > max ? p.finishedRes : max, result[0].finishedRes);

        function compare(a, b) {
          const priceA = Math.abs(a.price - average_price) / average_price;
          const priceB = Math.abs(b.price - average_price) / average_price;
          console.log("avg price and score");
          console.log(average_price);
          console.log(average_score);
          console.log(max_finished_res);
          const tagA = a.tag === favorite_tag ? 0 : 1;
          const tagB = a.tag === favorite_tag ? 0 : 1;
          const finishedResA = (max_finished_res - a.finishedRes) / max_finished_res;
          const finishedResB = (max_finished_res - b.finishedRes) / max_finished_res;
          const scoreA = (5 - a.avgScore) / 5;
          const scoreB = (5 - b.avgScore) / 5;

          const relavanceA = priceA * 0.4 + scoreA * 1.2 + finishedResA * 0.1 + tagA * 0.1;
          const relavanceB = priceB * 0.4 + scoreB * 1.2 + finishedResB * 0.1 + tagB * 0.1;
          console.log(relavanceA);
          console.log(relavanceB);
          let comparison = 0;
          if (relavanceA > relavanceB) {
            comparison = 1;
          } else if (relavanceA < relavanceB) {
            comparison = -1;
          }
          return comparison;
        }
        if (average_price !== null) {
          result.sort(compare);
        }
        // var str = result[0].availableDates;
        // console.log(str.slice(0, 10));
        result.forEach(function(item){
          item.availableDates = item.availableDates.toISOString().slice(0,10);
          item.tag = house_tags[item.tag];
        });

        res.status(200).send(result);
      });

    } else {
      connection.query(sql, function(err, result) {
        if (err) throw err;
        connection.release();

        result.forEach(function(item){
          item.availableDates = item.availableDates.toISOString().slice(0,10);
        });
        res.status(200).send(result);
      });
    }
  });
});

/** return average prices of the city you search */
router.get("/info/avgPrice/:cityname", (req, res) => {
  var city = req.params.cityname;
  let sql = `SELECT AVG(price) AS avgPrice FROM House GROUP BY city HAVING city = '${city}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result[0]);
    });
  });
});

// /**Return price range for data visualization, return a list.
//  * For element in the list, if null, front-end should give 0 after iterating the list*/
// router.get("/info/range/:cityname", (req, res) => {
//   var city = req.params.cityname;
//   let sql = `SELECT COUNT(*) AS countRangeA FROM House WHERE price > 0 AND price < 100 GROUP BY city HAVING city = '${city}';
//   SELECT COUNT(*) AS countRangeB FROM House WHERE price >= 100 AND price < 300 GROUP BY city HAVING city = '${city}';
//   SELECT COUNT(*) AS countRangeC FROM House WHERE price >= 300 AND price < 500 GROUP BY city HAVING city = '${city}';
//   SELECT COUNT(*) AS countRangeD FROM House WHERE price >= 500 GROUP BY city HAVING city = '${city}';`;
//   con.connection.getConnection(function(err, connection) {
//     if (err) throw err;
//     connection.query(sql, function(err, result) {
//       if (err) throw err;
//       connection.release();
//       res.send(result);
//     });
//   });
// });

/**Return price range for data visualization, return a list.
 * For element in the list, if null, front-end should give 0 after iterating the list*/
router.get("/info/range/:cityname", (req, res) => {
  var city = req.params.cityname;
  let sql = `SELECT COUNT(*) AS countRangeA FROM House WHERE price > 0 AND price < 100 GROUP BY city HAVING city = '${city}';
  SELECT COUNT(*) AS countRangeB FROM House WHERE price >= 100 AND price < 300 GROUP BY city HAVING city = '${city}';
  SELECT COUNT(*) AS countRangeC FROM House WHERE price >= 300 AND price < 500 GROUP BY city HAVING city = '${city}';
  SELECT COUNT(*) AS countRangeD FROM House WHERE price >= 500 GROUP BY city HAVING city = '${city}';`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      var rangeList = [];
      if (result[0].length < 1) {
        rangeList.push(0);
      } else {
        rangeList.push(result[0][0].countRangeA);
      }
      if (result[1].length < 1) {
        rangeList.push(0);
      } else {
        rangeList.push(result[1][0].countRangeB);
      }
      if (result[2].length < 1) {
        rangeList.push(0);
      } else {
        rangeList.push(result[2][0].countRangeC);
      }
      if (result[3].length < 1) {
        rangeList.push(0);
      } else {
        rangeList.push(result[3][0].countRangeD);
      }
      res.send(rangeList);
    });
  });
});

module.exports = router;
