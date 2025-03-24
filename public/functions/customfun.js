const soap = require("soap");
const url = "http://srv.svs-logistik.ru:2080/cs/maws.1cws?wsdl";
var j;

function srlist(UserID, Hash, UserIP) {

  var params = {
    UserIP: UserIP,
    Hash: Hash,
    UserId: UserID,
  };
  var args = { LoginXDTO: params };

  soap.createClient(url, function (err, client) {
    client.SiteSrdir(args, function (err, result) {
      var data = result.return;
      j = JSON.parse(data);
    });
  });

}

module.exports.srlist = srlist;
