const express = require("express");
const router = express.Router();

var con = require("./mysql_connect");
var img = require("./img_upload");

router.post("/postHouses", (req, res) => {
  var availableDates = req.body.availableDates;
  var price = req.body.price;
  var address = req.body.address;
  var city = req.body.city;
  var user_id = req.body.user_id;
  var tag = req.body.tag;
  var imgDir = req.body.imgDir;
  let sql = `INSERT INTO House (availableDates, price, address, city, user_id, avgScore, finishedRes, tag, imgDir) VALUES
                    ('${availableDates}', '${price}', '${address}', '${city}', '${user_id}', 0, 0, ${tag}, '${imgDir}');`;
  con.connection.getConnection(function(err, connection) {
    if (err) res.status(500).send({result: false});
    connection.query(sql, function(err, result) {
      if (err) res.status(500).send({result: false});
      console.log(result);
      
      connection.release();
      res.status(200).send({ result: result.insertId });
    });
  });
});
// router.post("/postHouse", (req, res) => {
//   var availableDates = req.query.availableDates;
//   var price = req.query.price;
//   var address = req.query.address;
//   var city = req.query.city;
//   var user_id = req.query.user_id;
//   let sql = `INSERT INTO House (availableDates, price, address, city, user_id) VALUES
//                     ('${availableDates}', '${price}', '${address}', '${city}', '${user_id}');`;
//   con.connection.getConnection(function(err, connection) {
//     if (err) throw err;
//     connection.query(sql, function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       connection.release();
//       res.send({ result: true });
//     });
//   });
// });

// router.post("/update", (req, res) => {

//   var house_id = req.body.house_id;
//   var updates = req.body.updates;
//   console.log(house_id);
//   console.log(updates);

//   con.connection.getConnection(function (err, connection) {
//     if(err) {
//         res.send({result : false});
//     } else {
//         updates.forEach(function (update) {
//         var sql = '';
//         if (typeof(update.value) === "string") {
//           sql = `UPDATE House SET ${update.attr} = '${update.value}' where house_id = ${house_id};`;
//         } else {
//           sql = `UPDATE House SET ${update.attr} = ${update.value} where house_id = ${house_id};`;
//         };
//         console.log(sql);
//         connection.query(sql, function(err, result) {
//           if (err) throw err;
//           console.log(result);
//         });

//         });
//         connection.release();
//     }
// });

//   res.send({result : true});

// });

router.post("/update", (req, res) => {
  con.connection.getConnection(function (err, connection) {
    if(err) {
        res.send({result : false});
    } else {

        var house_id = req.body.house_id;

        for (var key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            console.log('start sql');
            if (key === 'house_id') {
              continue;
            }
            var sql = '';
            if (typeof(req.body[key]) === "string") {
              sql = `UPDATE House SET ${key} = '${req.body[key]}' where house_id = ${house_id};`;
            } else {
              sql = `UPDATE House SET ${key} = ${req.body[key]} where house_id = ${house_id};`;
            };

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
  res.send({result : true});
});

router.post("/delete", (req, res) => {
  var house_id = req.body.house_id;

  con.connection.getConnection(function (err, connection) {
    if (err) throw err;
    let sql = `UPDATE House SET availableDates = '1970-01-01' where house_id = ${house_id};`;
    console.log(sql);
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result);
    });
    connection.release();
    res.send({result : true});
  });
});

router.get("/myhouse/:user_id", (req, res) => {
  var user_id = req.params.user_id;
  // var user_id = req.query.user_id;
  console.log(user_id);
  let sql = `SELECT *
      FROM House
      WHERE user_id = '${user_id}'`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      result.forEach(function(item){
        item.availableDates = item.availableDates.toISOString().slice(0,10);
      });
      res.send(result);
    });
  });
});

router.get("/index", (req, res) => {
  let sql = `SELECT *
      FROM House
      WHERE house_id = 3 or house_id = 8 or house_id = 9
      or house_id = 11 or house_id = 12 or house_id = 13`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result);
    });
  });
});

router.post('/uploadImg', function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        console.log("parsing done");
        console.log(files.upload.path);
        fs.writeFileSync("public/test.png", fs.readFileSync(files.upload.path));
        res.send(true);
    });
});

router.get("/houseDetail/:houseId", (req, res) => {
  var houseId = req.params.houseId;
  let sql = `select price, address, city, avgScore, tag from House where house_id = ${houseId}`;
  con.connection.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      connection.release();
      res.send(result);
    });
  });
});


// const multiparty = require("multiparty");

// router.post("/uploadImg", (req, res) => {
//   // var image = req.file.image;

//   let form = new multiparty.Form();
//   form.on('part', (part) => {
//     part.pipe(createWriteStream(`./tmp.jpg`))
//       .on('close', () => {
//         res.send(true);
//       })
//   })
// });

// router.post(
//   "/uploadImg",
//   upload.single("houseImg" /* name attribute of <file> element in your form */),
//   (req, res) => {
//     const tempPath = req.file.path;
//     const targetPath = path.join(__dirname, "./img/image.png");


//     if (path.extname(req.file.originalname).toLowerCase() === ".png") {
//       fs.rename(tempPath, targetPath, err => {
//         if (err) return handleError(err, res);

//         res
//           .status(200)
//           .contentType("text/plain")
//           .end("File uploaded!");
//       });
//     } else {
//       fs.unlink(tempPath, err => {
//         if (err) return handleError(err, res);

//         res
//           .status(403)
//           .contentType("text/plain")
//           .end("Only .png files are allowed!");
//       });
//     }
//   }
// );

module.exports = router;
