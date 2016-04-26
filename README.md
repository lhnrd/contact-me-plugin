### Dependencies

- [jquery](https://github.com/jquery/jquery) (1.7 and greater)
- [sifter](https://github.com/brianreavis/sifter.js) (bundled in ["standalone" build](dist/js/standalone))
- [microplugin](https://github.com/brianreavis/microplugin.js) (bundled in ["standalone" build](dist/js/standalone))

### Files

All pre-built files needed to use Selectize can be found in the ["dist"](dist/) folder.

- [**js/**](dist/js)
	- [**standalone/**](dist/js/standalone)
		- [selectize.js](dist/js/standalone/selectize.js) — With dependencies, minus jquery
	- [selectize.js](dist/js/selectize.js) — Without dependencies
- [**less/**](dist/less)
	- [selectize.less](dist/less/selectize.less) — Core styles
	- [selectize.default.less](dist/less/selectize.default.less) — Default theme
	- [selectize.bootstrap2.less](dist/less/selectize.bootstrap2.less) — Bootstrap 2 theme
	- [selectize.bootstrap3.less](dist/less/selectize.bootstrap3.less) — Bootstrap 3 theme
	- [**plugins/**](dist/less/plugins) — Individual plugin styles
- [**css/**](dist/css)
	- [selectize.css](dist/css/selectize.css) — Core styles
	- [selectize.default.css](dist/css/selectize.default.css) — Default theme (with core styles)
	- [selectize.bootstrap2.css](dist/css/selectize.bootstrap2.css) - Bootstrap 2 theme
	- [selectize.bootstrap3.css](dist/css/selectize.bootstrap3.css) - Bootstrap 3 theme

### Usage

```js
$('select').selectize(options);
```

The available options are [documented here](docs/usage.md).
