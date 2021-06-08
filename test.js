var { convertToHtml, toJson } = require("./mammoth");
let fs = require("fs");
const Server = require("./server");

var options = {};

toJson({ path: "RP.docx" }).then((e) => {
  Server(e.value);

  //console.log(e.value);
});
convertToHtml({ path: "RP.docx" }).then((e) => {
  //Server(e.value);
  fs.writeFileSync("inde.html", e.value);
  //console.log(e.value);
});
