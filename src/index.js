import css from 'css'
import md5 from 'spark-md5'
import _ from 'lodash'

const symbols = {
  '.': '',
  '#': '_'
}

function hash(val, hashLength) {
  return md5.hash(val).slice(0, hashLength)
}

export default function wapCss(styles, hashLength = 6, hashString = styles) {
  try {
    var ast = css.parse(styles)
  } catch(e) {
    console.log(e)
  }
  let sheet = ast.stylesheet,
    res = [],
    transformations = {},
    filePrefix = hash(hashString, hashLength),
    ignoreBlock = false

  sheet.rules.forEach(parseRule)

  return  {
    transformations: transformations,
    css: css.stringify(ast)
  }

  function parseRule (rule, i) {
    let type = rule.type,
      selectors = rule.selectors,
      rules = rule.rules,
      processed = []

    if (rules && rules.length) rules.forEach(parseRule)

    if (!selectors || !selectors.length) return checkIgnoreState(rule)

    for (let i = 0; i < selectors.length; i++) {
      let selector = selectors[i]
      processed.push(transformSelector(selector))
    }
    rule.selectors = processed
  }

  function addTransformation(key, value) {
    if (!transformations[key]) transformations[key] = value
  }

  function checkIgnoreState(rule) {
    if (rule.type != 'comment') return
    let comment = rule.comment,
      reStart = /wapCss.ignore.start/,
      reEnd = /wapCss.ignore.end/
    if (reStart.test(comment)) ignoreBlock = true
    if (reEnd.test(comment)) ignoreBlock = false
  }

  function getTransformation(key) {
    return transformations[key]
  }

  function transformSelector(selector) {
    let partsToTransform = selector.match(/(:global?|)[\.#][A-Za-z0-9_\-]+/g)
    if (!partsToTransform || !partsToTransform.length) return selector
    partsToTransform = partsToTransform.sort().reverse()

    for (let i = 0; i < partsToTransform.length; i++) {
      let partToTransform = partsToTransform[i]
      const isGlobal = /^:global/.test(partToTransform)
      partToTransform = isGlobal ? partToTransform.replace(/^:global/, '') : partToTransform
      let part = partToTransform.substr(1),
        prefix = partToTransform[0],
        transformedPrefix = transformPrefix(prefix),
        transformedPart = getTransformation(transformPrefix + part) || transformPart(part)
      if (ignoreBlock || isGlobal) transformedPart = part
      addTransformation(transformedPrefix + part, transformedPart)
    selector = selector.replace((isGlobal ? ':global' : '') + prefix + part, prefix + transformedPart)
    }

    return selector
  }

  function transformPrefix(prefix) {
    return symbols[prefix]
  }

  function transformPart(part) {
    return `_${filePrefix}-${part}`
  }
}
