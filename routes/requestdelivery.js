var express = require("express");
var router = express.Router();
const email = require("emailjs");
const bodyParser = require("body-parser");
const soap = require("soap");
const url = "http://srv.svs-logistik.ru:2080/cs/maws.1cws?wsdl";
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var data;

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies.logged == "true") {
    console.log(req.cookies);
    let content;
    //-------------------------------------------------------------------------------
    let params = {
      UserId: req.cookies.userId,
      Hash: req.cookies.hash,
      UserIP: req.connection.remoteAddress,
    };
    let paramsOne = JSON.stringify(params);
    //.log("ParamsOne is"+paramsOne);

    let args = { Param: paramsOne };
    console.log(args);

    soap.createClient(url, function (err, client) {
      if (err) {
        console.log(err);
      }
      client.SiteSrdirString(args, function (err, result) {
        if (err) {
          res.render("err", { logget: req.cookies.logged });
        }
        if (result == undefined) {
          res.render("err", { logget: req.cookies.logged });
        }

        if (result.return == "ws_err") {
          res.render("err", { logget: req.cookies.logged });
        }
        if (err) {
          console.log(err);
        }
        let data = result.return;
        //console.log("data "+data);
        if (data == "ws_err") {
          res.render("err", { logget: req.cookies.logged });
        }
        let j = JSON.parse(data);
        console.log(j.table);
        //------------------------------------------------
        if (req.query.copy) {
          let params = {
            UserIP: req.connection.remoteAddress.toString(),
            Hash: req.cookies.hash,
            UserId: req.cookies.userId,
            num: req.query.copy.toString(),
          };
          let paramsOne = JSON.stringify(params);
          let args = { param1: paramsOne };
          soap.createClient(url, function (err, client) {
            if (err) {
              console.log("first err is " + err);
            }
            client.test1(args, function (err, result) {
              if (err) {
                console.log("second err is " + err);
                res.render("err", { logget: req.cookies.logged });
              }
              if (result === undefined) {
                res.render("err", { logget: req.cookies.logged });
              }
              if (result.return == "ws_err") {
                res.render("err", { logget: req.cookies.logged });
              }
              //console.log("result is " + result);
              let data = result.return;
              //console.log("data is " + data);
              content = JSON.parse(data);
              res.render("requestdelivery", {
                logget: req.cookies.logged,
                table: j.table,
                content: content,
                pay: req.cookies.pay,
                bag: req.cookies.bag,
              });
            });
          });
        } else {
          content = "";

          res.render("requestdelivery", {
            logget: req.cookies.logged,
            table: j.table,
            content: content,
            pay: req.cookies.pay,
            bag: req.cookies.bag,
          });
        }
        //------------------------------------------------
      });
      //------------------------------------------------------
    });
  } else {
    let content = "";
    res.render("requestdelivery", {
      logget: req.cookies.logged,
      content: content,
      pay: req.cookies.pay,
      bag: "",
    });
  }
});
//------------------------------------------------------------
router.get("/:num", function (req, res, next) {
  let params = {
    UserIP: req.connection.remoteAddress.toString(),
    Hash: req.cookies.hash,
    UserId: req.cookies.userId,
    num: req.params.num.toString(),
  };
  let paramsOne = JSON.stringify(params);
  let args = { param1: paramsOne };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log("first err is " + err);
    }
    client.test1(args, function (err, result) {
      if (result == undefined) {
        res.render("err", { logget: req.cookies.logged });
      }
      if (result.return == "ws_err") {
        res.render("err", { logget: req.cookies.logged });
      }
      if (err) {
        console.log("second err is " + err);
      }

      var data = result.return;
      var j = JSON.parse(data);
      console.log(j);
      res.render("requestdelivery", {
        num: j,
        logget: req.cookies.logged,
        pay: req.cookies.pay,
      });
    });
  });
});
//------------------------------------------------------------
router.post("/", urlencodedParser, function (request, response) {
  const server = email.server.connect({
    user: "svs-logistiknsk@mail.ru",
    port: 465,
    password: "A1ng4y0dDUEngC7zazgV",
    host: "smtp.mail.ru",
    ssl: true,
  });

  if (request.cookies.logged == "true") {
    var params = {
      SendCity: request.body.SendCity,
      SendAdress: request.body.SendAdress,
      SendPhone: request.body.SendPhone,
      SendPerson: request.body.SendPerson,
      SendCompany: request.body.SendCompany,
      SendAddInfo: request.body.SendAddInfo,
      RecCity: request.body.RecCity,
      RecAdress: request.body.RecAdress,
      RecPhone: request.body.RecPhone,
      RecPerson: request.body.RecPerson,
      RecCompany: request.body.RecCompany,
      RecAddInfo: request.body.RecAddInfo,
      PayType: request.body.PayType,
      pay: request.body.pay,
      DelType: request.body.DelType,
      InsurValue: request.body.InsurValue,
      COD: request.body.COD,
      cargo: request.body.carg,
      dispInfo: request.body.dispInfo,
      Date: request.body.curDate,
      Time: request.body.curTime,
      Uved: request.body.Uved,
      thermochecker: request.body.thermochecker,
      Scan: request.body.Scan,
      Opasn: request.body.Opasn,
      Podp: request.body.Podp,
      Thermo: request.body.Thermo,
      UserId: request.cookies.userId,
      Hash: request.cookies.hash,
      UserIP: request.connection.remoteAddress,
    };
  } else {
    var params = {
      SendCity: request.body.SendCity,
      SendAdress: request.body.SendAdress,
      SendPhone: request.body.SendPhone,
      SendPerson: request.body.SendPerson,
      SendCompany: request.body.SendCompany,
      SendAddInfo: request.body.SendAddInfo,
      RecCity: request.body.RecCity,
      RecAdress: request.body.RecAdress,
      RecPhone: request.body.RecPhone,
      RecPerson: request.body.RecPerson,
      RecCompany: request.body.RecCompany,
      RecAddInfo: request.body.RecAddInfo,
      PayType: request.body.PayType,
      DelType: request.body.DelType,
      InsurValue: request.body.InsurValue,
      COD: request.body.COD,
      cargo: request.body.carg,
      dispInfo: request.body.dispInfo,
      Date: request.body.curDate,
      Time: request.body.curTime,
      Uved: request.body.Uved,
      Scan: request.body.Scan,
      thermochecker: request.body.thermochecker,
      Opasn: request.body.Opasn,
      Podp: request.body.Podp,
      Thermo: request.body.Thermo,
      UserId: "100000171",
      Hash: "",
      UserIP: request.connection.remoteAddress,
    };
  }
  console.log("cur_params");
  console.log(params);
  var paramsOne = JSON.stringify(params);
  var args = { Param: paramsOne };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log(err);
    }
    client.AddDispString(args, function (err, result) {
      if (result == undefined) {
        response.render("err", { logget: request.cookies.logged });
      }
      if (result.return == "ws_err") {
        response.render("err", { logget: request.cookies.logged });
      }
      if (err) {
        console.log(err);
      }
      var data = result.return;
      console.log(data);
      var j = JSON.parse(data);
      response.send(j.num);
      server.send(
        {
          text:
            "Номер накладной: " +
            j.num +
            "\r" +
            "Город отправителя: " +
            params.SendCity +
            "\r" +
            "Адрес отправителя: " +
            params.SendAdress,
          from: "<svs-logistiknsk@mail.ru>",
          to: "<info@svs-logistik.ru>, <adm@svs-logistik.ru>, <svs-logistiknsk@mail.ru>, <info-svs-logistik@mail.ru>",

          subject: "Новая накладная от " + j.customer,
        },
        function (err, message) {
          console.log(err || message);
        }
      );
    });
  });
});
module.exports = router;
