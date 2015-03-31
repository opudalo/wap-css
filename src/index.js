import css from 'css'
import md5 from 'spark-md5'
import _ from 'lodash'

const symbols = {
  '.': '',
  '#': '_'
}

function hash(val) {
  return md5.hash(val).slice(0, 3)
}

export default function wapCss(styles, DEV) {
  let ast = css.parse(styles)
    , sheet = ast.stylesheet
    , res = []
    , transformations = {}
    , filePrefix = hash(styles)


  sheet.rules.forEach((rule, i) => {
    let type = rule.type
      , selectors = rule.selectors
      , processed = []

    for (let i = 0; i < selectors.length; i++) {
      processed.push(transformSelector(selectors[i]))
    }
    rule.selectors = processed
  })

  return  {
    transformations: transformations,
    css: css.stringify(ast)
  }

  function addTransformation(key, value) {
    if (!transformations[key]) transformations[key] = value
  }

  function getTransformation(key) {
    return transformations[key]
  }

  function transformSelector(selector) {
    let partsToTransform = selector.match(/[\.#][A-Za-z0-9_\-]+/g)
    if (!partsToTransform || !partsToTransform.length) return selector
    partsToTransform = _(partsToTransform).sort().value().reverse()

    for (let i = 0; i < partsToTransform.length; i++) {
      let part = partsToTransform[i].substr(1)
        , prefix = partsToTransform[i][0]
        , transformedPrefix = transformPrefix(prefix)
        , transformedPart = getTransformation(transformPrefix + part) || transformPart(part)

      addTransformation(transformedPrefix + part, transformedPart)
      selector = selector.replace(prefix + part, prefix + transformedPart)
    }

    return selector
  }

  function transformPrefix(prefix) {
    return symbols[prefix]
  }

  function transformPart(part) {
    return '_' + filePrefix + '-' + (DEV ? part : hash(part))
  }
}
