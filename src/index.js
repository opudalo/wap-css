import css from 'css'
import random from 'alphanumeric'

export default function wapCss(styles, devMode) {
  let ast = css.parse(styles)
    , sheet = ast.stylesheet
    , res = []
    , dict = {}
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
    transformations: dict,
    css: css.stringify(ast)
  }

  function transformSelector(selector) {
    let sels = selector.split(' ')
      , res = []

    sels.forEach(tranfsormSel)


    return res.join(' ')

    function tranfsormSel(selector) {
      var  parts = []
        , curPart = ''
        , symbols = {
          '.': '$',
          '#': '_'
        }

      for (var i = selector.length - 1; i >= 0; i--) proc(selector[i], i == 0)

      res.push(parts.reverse().join(''))

      function proc(str, last) {
        if (!symbols[str]) {
          curPart = str + curPart
          if (last) tranfsormPart(curPart)
        } else {
          tranfsormPart(str+curPart)
          curPart = ''
        }
      }

      function tranfsormPart(part) {
        if (!part) return
        let sign = part[0]
        if (!symbols[sign]) return parts.push(part)

        part = part.substr(1)
        part = part.split(':')
        let replacement = dict[part[0]]
          ? dict[part[0]]
          : filePrefix + '-' + (devMode ? part[0] : random(3))
        dict[symbols[sign] + part[0]] = replacement
        part[0] = sign + replacement
        parts.push(part.join(':'))
      }
    }

  }

}
