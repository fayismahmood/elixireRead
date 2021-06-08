const { readRunProperties } = require("./body-reader");

exports.readStylesXml = readStylesXml;
exports.Styles = Styles;
exports.defaultStyles = new Styles({}, {});

function Styles(
  paragraphStyles,
  characterStyles,
  tableStyles,
  numberingStyles,
  dd
) {
  return {
    findParagraphStyleById: function (styleId) {
      //console.log(paragraphStyles, "D");
      // console.log(paragraphStyles, "ererere");
      return paragraphStyles[styleId];
    },
    dd: () => {
      return dd;
    },
    findCharacterStyleById: function (styleId) {
      return characterStyles[styleId];
    },
    findTableStyleById: function (styleId) {
      return tableStyles[styleId];
    },
    findNumberingStyleById: function (styleId) {
      return numberingStyles[styleId];
    },
  };
}

Styles.EMPTY = new Styles({}, {}, {}, {});

function readStylesXml(root) {
  var paragraphStyles = {};
  var characterStyles = {};
  var tableStyles = {};
  var numberingStyles = {};
  let dd = { a: "Adfad" };

  var styles = {
    paragraph: paragraphStyles,
    character: characterStyles,
    table: tableStyles,
  };
  let _defStyles = root.getElementsByTagName("w:docDefaults")[0];

  let _defStylesP = _defStyles
    .getElementsByTagName("w:pPrDefault")[0]
    .getElementsByTagName("w:pPr")
    .forEach((e) => {
      dd.paragraph = e;
    });
  let _defStylesR = _defStyles
    .getElementsByTagName("w:rPrDefault")[0]
    .getElementsByTagName("w:rPr")
    .forEach((e) => {
      dd.runs = e;
    });

  root.getElementsByTagName("w:style").forEach(function (styleElement) {
    var style = readStyleElement(styleElement);
    if (style.type === "numbering") {
      numberingStyles[style.styleId] = readNumberingStyleElement(styleElement);
    } else {
      var styleSet = styles[style.type];
      // console.log(styles[style.type], "sty");
      if (styleSet) {
        styleSet[style.styleId] = style;
      }
    }
  });

  return new Styles(
    paragraphStyles,
    characterStyles,
    tableStyles,
    numberingStyles,
    dd
  );
}

function readStyleElement(styleElement) {
  var type = styleElement.attributes["w:type"];
  var styleId = styleElement.attributes["w:styleId"];
  var name = styleName(styleElement);
  let props = { a: "sdfad" };
  //console.log(styleElement);
  if (styleElement.children) {
    props.pPr = styleElement.getElementsByTagName("w:pPr")[0];
    props.rPr = styleElement.getElementsByTagName("w:rPr")[0];

    //props = styleElement.children;
  }
  return { type: type, styleId: styleId, name: name, props };
}

function styleName(styleElement) {
  var nameElement = styleElement.first("w:name");
  return nameElement ? nameElement.attributes["w:val"] : null;
}

function readNumberingStyleElement(styleElement) {
  var numId = styleElement
    .firstOrEmpty("w:pPr")
    .firstOrEmpty("w:numPr")
    .firstOrEmpty("w:numId").attributes["w:val"];
  return { numId: numId };
}
