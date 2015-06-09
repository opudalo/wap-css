# wap-css

Checkout [example](https://github.com/opudalo/wap-css-example) repo.

## Installation

`npm i --save opudalo/wap-css`  

## Rationale

CSS class names conflict. This is so familiar.  
```css
//social.css
.social {
  top: 0
}

.social .description {
  top: 100px
}

//other.css
.description {
  color: red  
}
```

Unique class names to the rescue.  
```css
//social.css
.social {
  ...
}
.social-description {
  ...
}
.social-description-title {
  ...
}
.social-description-text {
  ...
}
```

We use Stylus to make it suck less.  
```stylus
// social.styl
.social
  ...
  &-description
  ...
    &-container
      ...
    &-title
      ...
    &-text
      ...
```

But it still sucks in js or html.

```js
$('.social-description-text').html('Hello')
```

```html
<div class="social">
  ...
  <div class="social-description">
    ...
    <div class="social-description-title">
      ...
    </div>
    <div class="social-description-text">
      ...
    </div>
  </div>
</div>
```


## Examples

It's the era of Webpack, React and overall awesomeness. Let's tie our CSS to JS/HTML.

```js
import styles from './social.styl'

let html = `
<div class=${styles.social}>
  <div class=${styles.description}>
    <div class=${styles.title}>
    </div>
    <div class=${styles.text}>
    </div>
  </div>
</div>
`
```

To ignore a block within the file use comments.
```css
  /* wapCss:ignore-start */
  div.warning { padding: 0; }
  div#myid { padding: 0; }
  /* wapCss:ignore-end */
```
