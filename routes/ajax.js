const url = "http://srv.svs-logistik.ru/cs/maws.1cws?wsdl";

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const soap = require("soap");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/adduserrequest", urlencodedParser, function (request, response) {
  console.log("adduserrequest", request.body);

  var param = JSON.stringify({
    quest: request.body.quest || "",
    position: request.body.position || "",
    name: request.body.name || "",
    inn: request.body.inn || "",
    company: request.body.company || "",
    nds: !!request.body.nds,
    email: request.body.email || "",
    type: request.body.type || "",
    phone: request.body.phone || "",
  });

  const args = { param };

  soap.createClient(url, function (err, client) {
    client.AddUserRequest(args, function (err, result) {
      var data = result.return;
      console.log("createClient", data);
      response.send(data);
    });
  });
});

router.post("/tracknum", urlencodedParser, function (request, response) {
  var args = { Num: request.body.num };

  soap.createClient(url, function (err, client) {
    client.History(args, function (err, result) {
      var data = result.return;

      var j = JSON.parse(data);
      if (j.result == "ws_err11" || j.result == "err1") {
        response.send("err");
      } else {
        response.send(j.table);
      }
    });
  });
});

router.post("/calculate", urlencodedParser, function (request, response) {
  if (request.cookies.hash) {
    var hash = request.cookies.hash;
  } else {
    var hash = "";
  }

  if (request.cookies.userId) {
    var userId = request.cookies.userId;
  } else {
    var userId = "";
  }
  var params = {
    SendCity: request.body.sendCity,
    RecCity: request.body.recdCity,
    Wight: request.body.weight.toString(),
    Volume: request.body.volume.toString(),
    UserIP: request.connection.remoteAddress.toString(),
    Hash: hash,
    UserId: userId,
  };
  var args = { CalcXDTO: params };
  console.log(args);
  soap.createClient(url, function (err, client) {
    client.Calculation(args, function (err, result) {
      var data = result.return;
      if (result == undefined) {
        response.send("err");
      }

      if (data == "Нет данных") {
        response.send("err");
      } else {
        var j = JSON.parse(data);
        response.send(j.data);
      }
    });
  });
});

//--------------заполнить из справочника----
router.post("/reqdel", urlencodedParser, function (request, response) {
  var params = {
    UserId: request.cookies.userId,
    Hash: request.cookies.hash,
    UserIP: request.connection.remoteAddress,
  };
  var args = { LoginXDTO: params };
  //console.log(args);

  soap.createClient(url, function (err, client) {
    client.SiteSrdir(args, function (err, result) {
      var data = result.return;
      console.log("data " + data);
      var j = JSON.parse(data);

      response.send(j.table);
      console.log("Таблица" + j.table);
    });
  });
});

module.exports = router;

//-----------------------------------------
router.post("/finddisp", urlencodedParser, function (request, response) {
  var params = {
    UserIP: request.connection.remoteAddress,
    Hash: request.cookies.hash,
    UserId: request.cookies.userId,
    from: request.body.from.toString(),
    to: request.body.to.toString(),
  };
  var args = { LoginXDTO: params };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log(err);
    }
    client.SiteDispatch(args, function (err, result) {
      if (result == undefined) {
        return "err";
      }
      if (result.return == "err1111" || result.return == "err2") {
        return "err";
        if (err) {
          console.log(err);
        }
      } else {
        var data = result.return;
        var j = JSON.parse(data);

        response.send(j.table);
      }
    });
  });
});

//-----------------Добавить шаблон-----------------
router.post("/addTemp", function (req, res, next) {
  var params = {
    UserIP: req.connection.remoteAddress.toString(),
    Hash: req.cookies.hash,
    UserId: req.cookies.userId,
    name: req.body.tempName,
    Address: req.body.tempAdress,
    City: req.body.tempCity,
    AddInfo: req.body.tempAddInfo,
    Company: req.body.tempCompany,
    Person: req.body.tempPerson,
    Phone: req.body.tempPhone,
  };

  var paramsOne = JSON.stringify(params);

  var args = { Param: paramsOne };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log("first err is " + err);
    }
    client.SrAddString(args, function (err, result) {
      if (err) {
        console.log("second err is " + err);
        res.render("templates", {
          logget: req.cookies.logged,
        });
      } else {
        var data = result.return;
        res.send(data);
        //-------------------------------------------
      }
    });
  });
});
//--------------------Удалить шаблон---------------------
router.post("/delTemp", function (req, res, next) {
  var params = {
    UserIP: req.connection.remoteAddress.toString(),
    Hash: req.cookies.hash,
    UserId: req.cookies.userId,
    name: req.body.name,
  };

  var paramsOne = JSON.stringify(params);

  var args = { Param: paramsOne };

  soap.createClient(url, function (err, client) {
    if (err) {
      console.log("first err is " + err);
    }
    client.SrDelString(args, function (err, result) {
      if (err) {
        console.log("second err is " + err);
        res.render("templates", {
          logget: req.cookies.logged,
        });
      } else {
        var data = result.return;
        res.send(data);
        //-------------------------------------------
      }
    });
  });
});
