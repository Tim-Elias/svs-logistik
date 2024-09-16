var express = require("express");
var router = express.Router();
const soap = require("soap");
const url = "http://srv.svs-logistik.ru/cs/maws.1cws?wsdl";

router.get("/:num", function (req, res, next) {
  var params = {
    UserIP: req.connection.remoteAddress.toString(),
    Hash: req.cookies.hash,
    UserId: req.cookies.userId,
    num: req.params.num.toString(),
  };

  var paramsOne = JSON.stringify(params);
  var args = { param1: paramsOne };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log("first err is " + err);
    }
    client.test1(args, function (err, result) {
      if (err) {
        console.log("second err is " + err);
      }
      if (result == undefined) {
        res.render("err", { logget: req.cookies.logged });
      }
      if (result.return == "ws_err") {
        res.render("err", { logget: req.cookies.logged });
      }
      var data = result.return;
      var j = JSON.parse(data);
      res.render("disp", { num: j, disp: req.params.num.toString() });
    });
  });
});

module.exports = router;
