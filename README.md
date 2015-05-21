# wap-css

Checkout [example](https://github.com/opudalo/wap-css-example) repo.

## Installation

`npm i --save opudalo/wap-css`  

## Rationale

Css class names conflict. This is so faimliar.  
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

We use stylus to make it suck less.  
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

But it still suck in js or html.

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

It's era of webpack, react and overall awesomeness. Lets tie our css to js/html

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

To ignore block within the file use comments
```css
  /* wapCss:ignore-start */
  div.warning { padding: 0; }
  div#myid { padding: 0; }
  /* wapCss:ignore-end */
```
