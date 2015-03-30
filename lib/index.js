"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = wapCss;

var css = _interopRequire(require("css"));

var random = _interopRequire(require("alphanumeric"));

function wapCss(styles, devMode) {
  var ast = css.parse(styles),
      sheet = ast.stylesheet,
      res = [],
      transformations = {},
      filePrefix = random(3);

  sheet.rules.forEach(function (rule, i) {
    var type = rule.type,
        selectors = rule.selectors,
        processed = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = selectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sel = _step.value;

        processed.push(transformSelector(sel));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    rule.selectors = processed;
  });

  return {
    transformations: transformations,
    css: css.stringify(ast)
  };

  function addTransformation(key, value) {
    transformations[key] = value;
  }

  function transformSelector(selector) {
    var partsToTransform = selector.match(/[\.#][A-Za-z0-9_\-]+/g);
    if (!partsToTransform || !partsToTransform.length) {
      return selector;
    }for (var i = 0; i < partsToTransform.length; i++) {
      var part = partsToTransform[i],
          replacement = transformations[part] || transform(part);

      selector.replace(part, replacement);
    }

    return selector;
  }

  function transform(part) {
    var prefix = part[0],
        prefixTransformations = {
      ".": "$",
      "#": "_"
    },
        transformedPrefix = prefixTransformations[prefix],
        transformedPart = undefined;

    part = part.substr(1);

    transformedPart = filePrefix + "-" + (devMode ? part : random(3));

    addTransformation(transformedPrefix + part, transformedPart);
    return transformedPart;
  }
}