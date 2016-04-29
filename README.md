# Contact Me jQuery Plugin

jQuery plugin that creates a simple form based on user entered fields.

### Getting started

- [Download the zip](https://github.com/lcsrinaldi/contact-me-plugin/archive/v0.0.1.zip) and include in your .html page.

### Dependencies

- [jquery](https://github.com/jquery/jquery)
- [skeleton](https://github.com/dhg/Skeleton)

### Files

All pre-built files needed to use ContactMe can be found in the ["dist"](dist/) folder.

- [**js/**](dist/js)
	- [contact-me.js](dist/js/contact-me.js) — Without dependencies
	- [contact-me.standalone.js](dist/js/contact-me.js) — With dependencies
- [**css/**](dist/less)
  - [contact-me.css](dist/css/contact-me.css) — Without dependencies
	- [contact-me.standalone.css](dist/css/contact-me.standalone.css) — With skeleton and normalize.css

### Usage

```js
$('.contact-me').contactMe(options);
```

The element `.contact-me` must be a `block` element or an `<a>` tag.

#### Options

Option|Description
---|---
`token` and `secret`| Token and secret numbers to validate the request.
`fields`| Key-value hash that uses the key as a form field (`email`, `password` generate specific input type). Value can be `true` or `false` to indicate obligatory field; and also an array to generate a `select` element.
`onSubmit`| Function that is called when the user press the *Submit* button. `this` object refers to the form in question.

### Development

- Clone the repo: `git clone https://github.com/lcsrinaldi/contact-me-plugin` (Note: this is under active development, so if you're looking for stable and safe, use the zipped download)
- `npm install && bower install`. Make sure you have both installed on your computer.

#### Gulpfile

- `gulp mock` creates a mock server on port `3005` to test and use the plugin.
- `gulp test` serves a page with automated test scripts included on port `3002`.
- `gulp serve` serves a page with two plugins test cases on port `3000`.
- `gulp build` create the distribution files on the `dist/` folder.
- `gulp` executes `server` and `test` altogether.
