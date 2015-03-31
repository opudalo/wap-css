"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = wapCss;

var css = _interopRequire(require("css"));

var md5 = _interopRequire(require("spark-md5"));

var _ = _interopRequire(require("lodash"));

var symbols = {
  ".": "",
  "#": "_"
};

function hash(val) {
  return md5.hash(val).slice(0, 3);
}

function wapCss(styles, DEV) {
  var ast = css.parse(styles),
      sheet = ast.stylesheet,
      res = [],
      transformations = {},
      filePrefix = hash(styles);

  sheet.rules.forEach(function (rule, i) {
    var type = rule.type,
        selectors = rule.selectors,
        processed = [];

    for (var _i = 0; _i < selectors.length; _i++) {
      processed.push(transformSelector(selectors[_i]));
    }
    rule.selectors = processed;
  });

  return {
    transformations: transformations,
    css: css.stringify(ast)
  };

  function addTransformation(key, value) {
    if (!transformations[key]) transformations[key] = value;
  }

  function getTransformation(key) {
    return transformations[key];
  }

  function transformSelector(selector) {
    var partsToTransform = selector.match(/[\.#][A-Za-z0-9_\-]+/g);
    if (!partsToTransform || !partsToTransform.length) {
      return selector;
    }partsToTransform = _(partsToTransform).sort().value().reverse();

    for (var i = 0; i < partsToTransform.length; i++) {
      var part = partsToTransform[i].substr(1),
          prefix = partsToTransform[i][0],
          transformedPrefix = transformPrefix(prefix),
          transformedPart = getTransformation(transformPrefix + part) || transformPart(part);

      addTransformation(transformedPrefix + part, transformedPart);
      selector = selector.replace(prefix + part, prefix + transformedPart);
    }

    return selector;
  }

  function transformPrefix(prefix) {
    return symbols[prefix];
  }

  function transformPart(part) {
    return filePrefix + "-" + (DEV ? part : hash(part));
  }
}