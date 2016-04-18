'use strict';

exports.__esModule = true;
exports.default = wapCss;

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _sparkMd = require('spark-md5');

var _sparkMd2 = _interopRequireDefault(_sparkMd);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var symbols = {
  '.': '',
  '#': '_'
};

function hash(val, hashLength) {
  return _sparkMd2.default.hash(val).slice(0, hashLength);
}

function wapCss(styles) {
  var hashLength = arguments.length <= 1 || arguments[1] === undefined ? 6 : arguments[1];
  var hashString = arguments.length <= 2 || arguments[2] === undefined ? styles : arguments[2];

  try {
    var ast = _css2.default.parse(styles);
  } catch (e) {
    console.log(e);
  }
  var sheet = ast.stylesheet,
      res = [],
      transformations = {},
      filePrefix = hash(hashString, hashLength),
      ignoreBlock = false;

  sheet.rules.forEach(parseRule);

  return {
    transformations: transformations,
    css: _css2.default.stringify(ast)
  };

  function parseRule(rule, i) {
    var type = rule.type,
        selectors = rule.selectors,
        rules = rule.rules,
        processed = [];

    if (rules && rules.length) rules.forEach(parseRule);

    if (!selectors || !selectors.length) return checkIgnoreState(rule);

    for (var _i = 0; _i < selectors.length; _i++) {
      var selector = selectors[_i];
      processed.push(transformSelector(selector));
    }
    rule.selectors = processed;
  }

  function addTransformation(key, value) {
    if (!transformations[key]) transformations[key] = value;
  }

  function checkIgnoreState(rule) {
    if (rule.type != 'comment') return;
    var comment = rule.comment,
        reStart = /wapCss.ignore.start/,
        reEnd = /wapCss.ignore.end/;
    if (reStart.test(comment)) ignoreBlock = true;
    if (reEnd.test(comment)) ignoreBlock = false;
  }

  function getTransformation(key) {
    return transformations[key];
  }

  function transformSelector(selector) {
    var partsToTransform = selector.match(/(:global?|)[\.#][A-Za-z0-9_\-]+/g);
    if (!partsToTransform || !partsToTransform.length) return selector;
    partsToTransform = partsToTransform.sort().reverse();

    for (var i = 0; i < partsToTransform.length; i++) {
      var partToTransform = partsToTransform[i];
      var isGlobal = /^:global/.test(partToTransform);
      partToTransform = isGlobal ? partToTransform.replace(/^:global/, '') : partToTransform;
      var part = partToTransform.substr(1),
          prefix = partToTransform[0],
          transformedPrefix = transformPrefix(prefix),
          transformedPart = getTransformation(transformPrefix + part) || transformPart(part);
      if (ignoreBlock || isGlobal) transformedPart = part;
      addTransformation(transformedPrefix + part, transformedPart);
      selector = selector.replace((isGlobal ? ':global' : '') + prefix + part, prefix + transformedPart);
    }

    return selector;
  }

  function transformPrefix(prefix) {
    return symbols[prefix];
  }

  function transformPart(part) {
    return '_' + filePrefix + '-' + part;
  }
}