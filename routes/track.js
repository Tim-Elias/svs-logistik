var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('track', { logget: req.cookies.logged });
});

module.exports = router;
