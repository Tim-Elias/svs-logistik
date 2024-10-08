var express = require("express");
var router = express.Router();
const soap = require("soap");
const url = "http://srv.svs-logistik.ru:2080/cs/maws.1cws?wsdl";

router.get("/:num", function (req, res, next) {
  if (req.cookies.logged == "true") {
    var params = {
      UserIP: req.connection.remoteAddress.toString(),
      Hash: req.cookies.hash,
      UserId: req.cookies.userId,
      num: req.params.num.toString(),
    };
  } else {
    var params = {
      UserId: "100000171",
      Hash: "ewfffffffffwe",
      UserIP: req.connection.remoteAddress,
      num: req.params.num.toString(),
    };
  }
  var paramsOne = JSON.stringify(params);
  //.log("ParamsOne is"+paramsOne);

  var args = { Param: paramsOne };
  console.log(args);

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log("first err is " + err);
    }
    client.GetFile(args, function (err, result) {
      if (err) {
        console.log("second err is " + err);
      }
      if (result == undefined) {
        res.render("err", { logget: req.cookies.logged });
      }
      if (result.return === "ws_err") {
        res.render("err", { logget: req.cookies.logged });
      } else {
        //console.log("result is " + result);
        var data = result.return;
        console.log("-------------data----------------");
        console.log(data);
        console.log("-------------data----------------");

        const download = Buffer.from(data.toString("utf-8"), "base64");

        res.end(download);

        //var j = JSON.parse(data);

        //--------------------------------------------
        //res.render("print",{num:j,params:params.num})
        //-------------------------------------------
      }
    });
  });
});

module.exports = router;
