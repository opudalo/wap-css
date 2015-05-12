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
  try {
    var ast = css.parse(styles);
  } catch (e) {
    console.log(e);
  }
  var sheet = ast.stylesheet,
      res = [],
      transformations = {},
      filePrefix = hash(styles),
      ignoreBlock = false;

  sheet.rules.forEach(parseRule);

  return {
    transformations: transformations,
    css: css.stringify(ast)
  };

  function parseRule(rule, i) {
    var type = rule.type,
        selectors = rule.selectors,
        rules = rule.rules,
        processed = [];

    if (rules && rules.length) rules.forEach(parseRule);

    if (!selectors || !selectors.length) {
      return checkIgnoreState(rule);
    }for (var _i = 0; _i < selectors.length; _i++) {
      var selector = selectors[_i];
      processed.push(transformSelector(selector));
    }
    rule.selectors = processed;
  }

  function addTransformation(key, value) {
    if (!transformations[key]) transformations[key] = value;
  }

  function checkIgnoreState(rule) {
    if (rule.type != "comment") {
      return;
    }var comment = rule.comment,
        reStart = /wapCss.ignore.start/,
        reEnd = /wapCss.ignore.end/;
    if (reStart.test(comment)) ignoreBlock = true;
    if (reEnd.test(comment)) ignoreBlock = false;
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

      if (ignoreBlock) transformedPart = part;
      addTransformation(transformedPrefix + part, transformedPart);
      selector = selector.replace(prefix + part, prefix + transformedPart);
    }

    return selector;
  }

  function transformPrefix(prefix) {
    return symbols[prefix];
  }

  function transformPart(part) {
    return "_" + filePrefix + "-" + (DEV ? part : hash(part));
  }
}