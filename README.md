javascript-clock-speedup
========================

Simulates a faster `Date` object. You can use this for debugging, for example to test how your code reacts to date changes.

The code uses `eval`, it's not safe for production.

## How to use

Just include the clock-speedup.js file. It will replace the native date object and increase the clock speed by a factor of five.

If your site uses jQuery a UI will show up displaying the date/time, speedup factor and allowing you to adjust the factor.

## Additional properties of the Date object

### setSpeedupFactor(factor)

A factor of 1 means no speedup. 2 means two fake seconds per real second, .5 means one fake second per real second.

### hideUi()

Hide the UI if jQuery was included.

### NativeDate

The native Date object, without any speedup.

## License

[CC0](http://creativecommons.org/publicdomain/zero/1.0/).
