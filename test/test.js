import 'babel/polyfill'
import wapCss from '../src/index'
import {expect} from 'chai'


describe('wap-css basics', function () {
  it('should exist', function (done) {
    expect(wapCss).to.be.function
    done()
  })

  let cases = [{
    css: `div.warning { padding: 0; }
      div#myid { padding: 0; }`,
    transformations: {
      $warning: '',
      _myid: ''
    }
  }]

  it('should parse IDs and classes', function (done) {
    let css = `
      div.warning { padding: 0; }
      div#myid { padding: 0; }`
      , style = wapCss(css, true)
    expect(style).to.exist

    let dict = style.transformations
    expect(dict.$warning).to.exist
    expect(dict._myid).to.exist
    done()
  })

  it('should parse complex selectors', function (done) {
    let css = `
      div.warning > div.some#myid ~ div.some[foo="bar"]:first-child { padding: 0; }
      div#myid > .some.warning:not(.some) { padding: 0; }`
      , style = wapCss(css, true)
      , transformations = {
        $warning: '',
        $some: '',
        _myid: ''
      }
    expect(style).to.exist

    let dict = style.transformations
    expect(dict.$warning).to.exist
    expect(dict.$warning).to.exist
    expect(dict._myid).to.exist
    done()
  })

  it('should change only IDs and classes', function (done) {
    let css = `
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
      div:not(some) { padding: 0; }`
      , style = wapCss(css, true)

    style.css = style.css.replace(/\s/g, '')
    css = css.replace(/\s/g, '')

    expect(style.css).to.be.equal(css)
    done()
  })
})

function log(css, style) {
  console.log('Was:\n', css)
  console.log('Transformed:\n', style.css)
  console.log('Dictionary:\n', style.transformations)
}
