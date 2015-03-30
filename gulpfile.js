// NOTE must be es5
/*eslint no-var: 0, strict: [2, "global"] */
'use strict'
useBabel(__dirname)

var gulp = require('gulp')
  , tasks = require('./tools/gulpTasks')

tasks(gulp, __dirname)

function useBabel(options) {
  if (typeof options == 'string')
    options = {
      rootDir: options
    }

  options = options || {}
  if (!('experimental' in options)) options.experimental = true
  if (options.rootDir) options = configDepth(options)

  require('babel/register')(options)
  // workaround for broken gulp-watch
  // https://github.com/babel/babel/issues/489#issuecomment-85736890
  Object.getPrototypeOf.toString = function() {
    return Object.toString()
  }
}

function escapeRe (v) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function configDepth (options){
  var rootDir = escapeRe(options.rootDir)
  delete options.rootDir
  options.only = new RegExp('^' + rootDir + '/')

  var ignoreSubdirs = options.ignoreSubdirs || ['node_modules']
  if (options.ignoreSubdirs) {
    delete options.ignoreSubdirs
  }
  if (options.extendIgnoreSubdirs != null) {
    ignoreSubdirs = ignoreSubdirs.concat(options.extendIgnoreSubdirs)
    delete options.extendIgnoreSubdirs
  }
  if (ignoreSubdirs && ignoreSubdirs.length > 0) {
    var re = '^' + rootDir + '/(' + ignoreSubdirs.map(escapeRe).join('|') + ')/'
    options.ignore = new RegExp(re)
  }
  return options
}

