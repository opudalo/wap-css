import css from 'css'
import random from 'alphanumeric'

export default function wapCss(styles, devMode) {
  let ast = css.parse(styles)
    , sheet = ast.stylesheet
    , res = []
    , transformations = {}
    , filePrefix = random(3)


  sheet.rules.forEach((rule, i) => {
    let type = rule.type
      , selectors = rule.selectors
      , processed = []

    for (let sel of selectors) {
      processed.push(transformSelector(sel))
    }
    rule.selectors = processed
  })

  return  {
    transformations: transformations,
    css: css.stringify(ast)
  }

  function addTransformation(key, value) {
    transformations[key] = value
  }

  function transformSelector(selector) {
    let partsToTransform = selector.match(/[\.#][A-Za-z0-9_\-]+/g)
    if (!partsToTransform || !partsToTransform.length) return selector

    for (let i = 0; i < partsToTransform.length; i++) {
      let part = partsToTransform[i]
        , replacement = transformations[part] || transform(part)

      selector.replace(part, replacement)
    }

    return selector
  }

  function transform(part) {
    let prefix = part[0]
      , prefixTransformations = {
        '.': '$',
        '#': '_'
      }
      , transformedPrefix = prefixTransformations[prefix]
      , transformedPart

    part = part.substr(1)

    transformedPart = filePrefix + '-' + (devMode ? part : random(3))

    addTransformation(transformedPrefix + part, transformedPart)
    return transformedPart
  }

}
