import 'babel/polyfill'
import wapCss from '../src/index'
import _ from 'lodash'
import {expect} from 'chai'

describe('wap-css basics', function () {

  it('should exist', function (done) {
    expect(wapCss).to.be.function
    done()
  })

  let cases = [{
  /*  label: 'should parse IDs and classes',
    css: `
      div.warning { padding: 0; }
      div#myid { padding: 0; }
    `,
    transformations: {
      warning: '',
      _myid: ''
    }
  }, {*/
    label: 'should not parse marked css',
    css: `
      /* wapCss:ignore-start */
      div.warning { padding: 0; }
      div#myid { padding: 0; }
      /* wapCss:ignore-end */
    `,
    transformations: {
      warning: '',
      _myid: ''
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
  /*}, {
    label: 'should parse media queries',
    css: `
      @media (max-width: 600px) {
        .media { display: none; }
      }
    `,
    transformations: {
      media: ''
    }
  }, {
    label: 'should parse complex selectors',
    css: `
      div.warning > div.some#myid ~ div.some[foo="bar"]:first-child { padding: 0; }
      div#myid > .some.warning:not(.some) { padding: 0; }
    `,
    transformations: {
      warning: '',
      some: '',
      _myid: ''
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
    transformations: {}*/
  }]

  cases.forEach(({ label, transformations, css}) => {

    it(label, (done) => {
      let style = wapCss(css)
        , _css = style.css
        , _transformations = style.transformations

      log(_css, _transformations)

      expect(_(transformations).size()).to.be.equal(_(_transformations).size())
      _(transformations).keys()
        .each((key) => expect(_transformations[key]).to.exist )

      done()
    })
  })
})

function log(css, transformations) {
  console.log('Was:\n', css)
  console.log('Transformed:\n', transformations)
}


