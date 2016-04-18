import wapCss from '../src/index'
import test from 'tape'
import _ from 'lodash'

const IS_LOCAL = {}
const cases = [{
  label: 'should parse IDs and classes',
  css: `
    div.warning { padding: 0; }
    div#myid { padding: 0; }
  `,
  transformations: {
    warning: IS_LOCAL,
    _myid: IS_LOCAL
  }
}, {
  label: 'should respect :global selector',
  css: `
    :global.warning { padding: 0; }
    :global#myid { padding: 0; }
  `,
  transformations: {
    warning: 'warning',
    _myid: 'myid'
  },
  debug: true
}, {
  label: 'should not parse marked css',
  css: `
    /* wapCss:ignore-start */
    div.warning { padding: 0; }
    div#myid { padding: 0; }
    /* wapCss:ignore-end */
  `,
  transformations: {
    warning: 'warning',
    _myid: 'myid'
  }
}, {
  label: 'should not touch comments',
  css: `
    /* single line comment */

    /*
    *  multi
    *  line
    *  comment
    *  */
  `,
  transformations: {}
}, {
  label: 'should parse media queries',
  css: `
    @media (max-width: 600px) {
      .media { display: none; }
    }
  `,
  transformations: {
    media: IS_LOCAL
  }
}, {
  label: 'should parse complex selectors',
  css: `
    div.warning > div.some#myid ~ div.some[foo="bar"]:first-child { padding: 0; }
    div#myid > .some.warning:not(.some) { padding: 0; }
  `,
  transformations: {
    warning: IS_LOCAL,
    some: IS_LOCAL,
    _myid: IS_LOCAL
  }
}, {
  label: 'should change only IDs and classes',
  css: `
    div[foo] { top: 0; }
    div[foo="bar"] { padding: 0; }
    div[foo~="bar"] { padding: 0; }
    div[foo^="bar"] { padding: 0; }
    div[foo$="bar"] { padding: 0; }
    div[foo*="bar"] { padding: 0; }
    div[foo|="en"] { padding: 0; }
    div:root { padding: 0; }
    div:nth-child(1) { padding: 0; }
    div:nth-last-child(3) { padding: 0; }
    div:nth-of-type(5) { padding: 0; }
    div:nth-last-of-type(2) { padding: 0; }
    div:first-child { padding: 0; }
    div:last-child { padding: 0; }
    div:first-of-type { padding: 0; }
    div:last-of-type { padding: 0; }
    div:only-child { padding: 0; }
    div:only-of-type { padding: 0; }
    div:empty { padding: 0; }
    div:link { padding: 0; }
    div:visited { padding: 0; }
    div:active { padding: 0; }
    div:hover { padding: 0; }
    div:focus { padding: 0; }
    div:target { padding: 0; }
    div:lang(fr) { padding: 0; }
    div:enabled { padding: 0; }
    div:disabled { padding: 0; }
    div:checked { padding: 0; }
    div::first-line { padding: 0; }
    div::first-letter { padding: 0; }
    div::before { padding: 0; }
    div::after { padding: 0; }
    div:not(some) { padding: 0; }
  `,
  transformations: {}
}]

test('wap-css basics', t => {
  t.equal(typeof wapCss, 'function', 'should exist')
  t.end()
})

cases.forEach(({ label, transformations: expectedTransformations, css: initialCss, debug}) => {
  const testOne = t => {
    const style = wapCss(initialCss),
      css = style.css,
      transformations = style.transformations

    if (debug) log(initialCss, css, transformations)

    t.equal(
      Object.keys(expectedTransformations).length,
      Object.keys(transformations).length,
      'all rules were parsed'
    )
    Object.keys(transformations).forEach(key => {
      const val = expectedTransformations[key]
      // hack to work with ID replacements
      const k = key.replace(/^_/, '')
      const re = new RegExp(`_[A-Za-z0-9]+-${k}$`)
      const transformed = transformations[key]
      if (val === IS_LOCAL) t.ok(re.test(transformed), 'values processed')
      else t.equals(transformed, k, 'equals in global mode')
    })
    t.end()
  }

  test(label, testOne)
})



function log(initial, css, transformations) {
  console.log('Initial CSS:\n', initial)
  console.log('Processed CSS:\n', css)
  console.log('Transformations:\n', transformations)
}


