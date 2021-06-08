let http = require("http");
let fs = require("fs");
var brotli = require("brotli");

var tou8 = require("buffer-to-uint8array");

let _tes = fs.readFileSync("./package.json");
let _comP = brotli.compress(_tes);
fs.writeFileSync("pkg.br", _comP);

let dd = fs.readFileSync("./pkg.br");

//console.log(tou8(dd), _comP);
function Server(_para) {
  http
    .createServer((req, res) => {
      if (req.url == "/d") {
        //let _ = JSON.stringify({ data: _para });
        // let _comP = brotli.compress(Buffer.from(_));

        // fs.writeFileSync("RP.br", _comP);
        let dd = fs.readFileSync("./RP.br");

        res.setHeader("Content-Encoding", "br");
        res.setHeader("Content-Type", "application/json;");
        res.write(tou8(dd));
        //res.write(_);
        // console.log(tou8(dd));
        // res.write(_comP);
        res.end();
      }
      let _tes = fs.readdirSync("./tes");
      _tes.forEach((e) => {
        if (req.url == "/tes/" + e) {
          let _f = fs.readFileSync("./tes/" + e, "utf-8");
          res.write(_f);
          res.end();
        }
      });
    })
    .listen(800);
}
module.exports = Server;
