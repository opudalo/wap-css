"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = wapCss;

var css = _interopRequire(require("css"));

var random = _interopRequire(require("alphanumeric"));

function wapCss(styles) {
  var obj = css.parse(styles);

  console.log(obj);
}