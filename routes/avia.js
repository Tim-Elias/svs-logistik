var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const soap = require('soap');
const url = 'http://5.59.125.35/cs/maws.1cws?wsdl';
const urlencodedParser = bodyParser.urlencoded({extended: false});


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('avia', { logget: req.cookies.logged});

});

module.exports = router;
