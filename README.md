# manage-side-effects

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Manage side effects in your application.

Great for keeping event listeners and 3rd party plugin instances with their
cleanup methods in one place.

Concept is similar to
[`useEffect` hook in React](https://reactjs.org/docs/hooks-effect.html).

## Install

```sh
npm install manage-side-effects --save
```

## Usage

```js
import manageSideEffects from 'manage-side-effects';

const sideEffects = manageSideEffects();

// Register side effect
sideEffects.add(() => {
	const handler = (event) => {
		// Handle document click event
	};
	document.addEventListener('click', handler);
	return () => {
		document.removeEventListener('click', handler);
	};
});

// Register named side effect
sideEffects.add(() => {
	const handler = (event) => {
		// Handle document keydown event
	};
	document.addEventListener('keydown', handler);
	return () => {
		document.removeEventListener('keydown', handler);
	};
}, 'documentKeydownHandler');

// Remove named registered side effect
sideEffects.remove('documentKeydownHandler');

// Remove all registered side effects
sideEffects.removeAll();
```

## API

### manageSideEffects()

Returns: `Object`

Creates side effects manager instance.

### instance.add(sideEffect[, id])

Register side effect, providing optional ID for that side effect.

#### sideEffect

Type: `Function`  
Returns: `Function`

Side effect to register.

Return value should be function which contains cleanup code (e.g. event listener
removing). If return value is not a function, a noop function will be used as
return value.

#### id

Type: `string`

Side effect ID. Useful when you want to give side effect name so you can easily
remove it with [`remove`](#remove) method.

### instance.remove(id)<a name="remove"></a>

Remove side effect with provided ID.

#### id

Type: `string`

Side effect ID.

### instance.removeAll()

Remove all side effects.

## Browser support

Tested in IE9+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/manage-side-effects
[ci-img]: https://travis-ci.com/niksy/manage-side-effects.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=dXhKMzErNzFUUVBoODRDbE44KzBKZHlZTWp6Z1MweUxENWlhZDZzTkdvYz0tLXM1c1dhS0IwSUFvM25RZnRpMm9lbFE9PQ==--17a00c20a8c92ddd72ede14849cd244077502d12

<!-- prettier-ignore-end -->
