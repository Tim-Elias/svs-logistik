var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const soap = require("soap");
const url = "http://srv.svs-logistik.ru:2080/cs/maws.1cws?wsdl";
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("cargo", { logget: req.cookies.logged });
});

module.exports = router;
