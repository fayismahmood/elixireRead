fetch("../d")
  .then((e) => e.json())
  .then((e) => {
    let Ordered = Ordering(e.data);

    console.log(Ordered);
    let _d = document.querySelector(".Pages");
    // _d.append(Render(Ordered));
    Pager(Render(Ordered), _d);
  });

// fetch("../d")
//   .then((e) => e.text())
//   .then((e) => {
//     console.log(e);
//     let dd = new TextDecoder();
//     dd.decode(e);
//   });

let currPage = 0;
let pages = {};
function Pager(doms, doc) {
  let pageWidth = window.window - 90;
  let pageHeight = 500;

  function createPage() {
    let Page = document.createElement("div");
    Page.style.width = pageWidth + "px";
    Page.style.display = "flex";
    Page.style.flexDirection = "column";

    //Page.style.height = pageHeight + "px";
    return Page;
  }
  //console.log(doms);
  let mm = document.createElement("div");
  doc.append(mm);
  mm.style.width = pageWidth + "px";
  mm.style.visibility = "hidden";
  function domSizeCalc(dom) {
    mm.append(dom);
    let _ = dom.offsetHeight;
    mm.innerHTML = "";
    console.log(_);
    return _;
  }

  function RenderPage(page) {
    let PageContainer = document.createElement("div");
    PageContainer.style.padding = "50px 30px";
    PageContainer.style.margin = "30px";

    PageContainer.style.minHeight = pageHeight + "px";
    PageContainer.style.width = pageWidth + "px";
    PageContainer.className = "PgCont";
    PageContainer.append(page);
    return PageContainer;
  }

  function CheckPageBreake(e) {
    let Check_break = e.querySelector("BREAK") ? true : false;

    if (Check_break) {
      if (e.querySelector("BREAK").type == "page") {
        return true;
      }
    }
    return false;
  }

  Array.from(doms.children).forEach((e) => {
    let PrHeight =
      pages[currPage] && pages[currPage].offsetHeight + domSizeCalc(e);
    let PageBreake = e.tagName == "BREAK" && e.type == "page";

    if (PageBreake) {
      alert("df");
    }
    if (currPage == 0 || PrHeight >= 500) {
      currPage++;
      pages[currPage] = createPage();
      doc.append(RenderPage(pages[currPage]));
      //console.log(PrHeight, "Inc");
    }

    pages[currPage].append(e);

    if (CheckPageBreake(e)) {
      currPage++;
      pages[currPage] = createPage();
      doc.append(RenderPage(pages[currPage]));
    }

    // console.log(currPage, e, PrHeight);

    //console.log(window.getComputedStyle(e));

    // console.log(e.getBoundingClientRect().height);
  });
}

function Ordering(obj) {
  let _obj = { ...obj };

  let _ = {};

  let { type, children } = _obj;
  _.type = type;
  if (children) {
    _.children = children.map((e) => {
      return Ordering(e);
    });
  }

  delete _obj.type;
  delete _obj.children;

  _.props = _obj;

  return _;
}

function RenderElm(obj, tag) {
  let { children, props } = obj;
  let _dom = document.createElement(tag);

  if (props) {
    Object.entries(props).forEach((e) => {
      let key = e[0];
      let val = e[1];
      // _dom.setAttribute(key, val);
      PropFuncs[key] && PropFuncs[key](_dom, val);
    });
  }
  if (children) {
    children.forEach((elm) => {
      if (Render(elm).ELEMENT_NODE) {
        _dom.append(Render(elm));
      }
      if (typeof Render(elm) == "string") {
        _dom.append(Render(elm));
      }
    });
  }
  return _dom;
}

let types = {
  paragraph: (obj) => {
    let _dom = RenderElm(obj, "p");
    return _dom;
  },
  document: (obj) => {
    let _dom = RenderElm(obj, "div");
    return _dom;
  },
  run: (obj) => {
    let _dom = RenderElm(obj, "span");
    return _dom;
  },
  text: (obj) => {
    let { children, props } = obj;
    //console.log(props.value, "bb");
    return props.value ? props.value : "";
  },
  hyperlink: (obj) => {
    let _dom = RenderElm(obj, "a");
    _dom.href = "#" + obj.props.anchor;
    return _dom;
  },
  tab: (obj) => {
    let _dom = RenderElm(obj, "span");
    //console.log(_dom);
    _dom.style.marginLeft = "20px";
    return _dom;
  },
  image: (obj) => {
    let _dom = RenderElm(obj, "img");
    _dom.src = obj.props.imgData.fulfillmentValue;
    return _dom;
  },
  break: (obj) => {
    console.log("brrrrrrrrrrrrrrrrrreak");
    let _dom = RenderElm(obj, "break");
    _dom.type = "page";
    // _dom.style.height = "500px";
    return _dom;
  },
};

let Numberings = {};

let PropFuncs = {
  fontSize: (dom, prop) => {
    dom.style.fontSize = prop + "pt";
  },
  alignment: (dom, prop) => {
    let als = {
      left: "left",
      right: "right",
      both: "justify",
      start: "left",
      center: "center",
      end: "right",
    };
    dom.style.textAlign = als[prop];
  },
  isAllCaps: (dom, prop) => {
    if (prop) {
      dom.style.textTransform = "uppercase";
    }
  },
  isBold: (dom, prop) => {
    if (prop) {
      dom.style.fontWeight = "bold";
    }
  },
  isItalic: (dom, prop) => {
    if (prop) {
      dom.style.fontStyle = "italic";
    }
  },
  isSmallCaps: (dom, prop) => {
    if (prop) {
      dom.style.textTransform = "lowercase";
    }
  },
  isStrikethrough: (dom, prop) => {
    if (prop) {
      dom.style.textDecoration = "line-through";
    }
  },
  isUnderline: (dom, prop) => {
    if (prop) {
      dom.style.textDecoration = "underline";
    }
  },
  indent: (dom, prop) => {
    if (prop) {
      dom.style.margin = `auto ${
        Number(prop.start) / 20 - Number(prop.hanging) / 20 + "pt"
      }`;
    }
  },
  numbering: (dom, prop) => {
    let formates = {
      bullet: (dom) => setNumberingStyle(dom, "disc"),
      decimal: (dom, prop) => {
        let _id = prop.numId + prop.level;
        if (!Numberings[_id]) {
          Numberings[_id] = [];
        }

        if (!prop.index) {
          Numberings[_id].push(prop);
          let _ = Numberings[_id].length;
          prop.index = _;
        }

        dom.style.listStyle = `'${prop.index}. ' inside`;
      },
      lowerLetter: (dom, prop) => {
        let _id = prop.numId + prop.level;
        function idOf(i) {
          return (
            (i >= 26 ? idOf(((i / 26) >> 0) - 1) : "") +
            "abcdefghijklmnopqrstuvwxyz"[i % 26 >> 0]
          );
        }
        if (!Numberings[_id]) {
          Numberings[_id] = [];
        }

        if (!prop.index) {
          Numberings[_id].push(prop);
          let _ = Numberings[_id].length;
          prop.index = _;
        }

        dom.style.listStyle = `'${idOf(prop.index - 1)}. ' inside`;
      },
      lowerRoman: (dom, prop) => {
        let _id = prop.numId + prop.level;
        function romanize(num) {
          var lookup = {
              m: 1000,
              cm: 900,
              d: 500,
              cd: 400,
              c: 100,
              xc: 90,
              l: 50,
              xl: 40,
              x: 10,
              ix: 9,
              v: 5,
              iv: 4,
              I: 1,
            },
            roman = "",
            i;
          for (i in lookup) {
            while (num >= lookup[i]) {
              roman += i;
              num -= lookup[i];
            }
          }
          return roman;
        }

        if (!Numberings[_id]) {
          Numberings[_id] = [];
        }

        if (!prop.index) {
          Numberings[_id].push(prop);
          let _ = Numberings[_id].length;
          prop.index = _;
        }

        dom.style.listStyle = `'${romanize(prop.index)}. ' inside`;
      },
      upperRoman: (dom, prop) => {
        let _id = prop.numId + prop.level;
        function romanize(num) {
          var lookup = {
              M: 1000,
              CM: 900,
              D: 500,
              CD: 400,
              C: 100,
              XC: 90,
              L: 50,
              XL: 40,
              X: 10,
              IX: 9,
              V: 5,
              IV: 4,
              I: 1,
            },
            roman = "",
            i;
          for (i in lookup) {
            while (num >= lookup[i]) {
              roman += i;
              num -= lookup[i];
            }
          }
          return roman;
        }

        if (!Numberings[_id]) {
          Numberings[_id] = [];
        }

        if (!prop.index) {
          Numberings[_id].push(prop);
          let _ = Numberings[_id].length;
          prop.index = _;
        }

        dom.style.listStyle = `'${romanize(prop.index)}. ' inside`;
      },
      upperLetter: (dom, prop) => {
        let _id = prop.numId + prop.level;
        function idOf(i) {
          return (
            (i >= 26 ? idOf(((i / 26) >> 0) - 1) : "") +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i % 26 >> 0]
          );
        }
        if (!Numberings[_id]) {
          Numberings[_id] = [];
        }

        if (!prop.index) {
          Numberings[_id].push(prop);
          let _ = Numberings[_id].length;
          prop.index = _;
        }

        dom.style.listStyle = `'${idOf(prop.index - 1)}. ' inside`;
      },
    };

    if (prop) {
      dom.style.display = "list-item";
      formates[prop.format](dom, prop);
    }
  },
  spacing: (dom, prop) => {
    let { before, after, line } = prop;
    dom.style.marginTop = before + "pt";
    dom.style.marginBottom = after + "pt";
    //dom.style.lineHeight = line + "pt";
    dom.style.minHeight = line + "pt";
  },
  color: (dom, prop) => {
    dom.style.color = "#" + prop;
  },
  background: (dom, prop) => {
    dom.style.background = "#" + prop;
  },
};

function setNumberingStyle(dom, frm) {
  dom.style.listStyle = `${frm} inside`;
}

function Render(obj) {
  let _d = types[obj["type"]] ? types[obj["type"]](obj) : "";
  return _d;
}
