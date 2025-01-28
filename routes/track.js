var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const orderNo = req.query.order_no || "";
  res.render("track", { logget: req.cookies.logged, orderNo: orderNo });
});

module.exports = router;
