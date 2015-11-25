# require-multi
> A node.js utility, allowing you to require multiple modules at once using globs and reduce your boilerplate.

[![Coverage Status](https://coveralls.io/repos/StickyCube/require-array/badge.svg?branch=master&service=github)](https://coveralls.io/github/StickyCube/require-array?branch=master)

[![Build Status](https://travis-ci.org/StickyCube/require-array.svg?branch=master)](https://travis-ci.org/StickyCube/require-array)

### Description
require-multi is a simple utility for bulk requiring entire directories into a single array using glob patterns.

```javascript

// routes/middleware/index.js
var requireall = require('require-multi');

var inject = function (mod) {
  return mod({ router: router, db: database });
};

requireall('middleware/login/*.js', 'middleware/**/*.js', '!**/private/not-this.js', { resolve: inject });

app.use('*', router)

```

## API

### requireall([path, [path, ...]], [options]);

* path - String [default = `'./*.js'`] - Specify as many relative paths as you want to require files from. Exclusions can be set by prefixing with `!`.
* options - Object - augment the behavior (see options section below)

### Options

#### `options.resolve - Function (module, filename)`
the resolve callback is invoked for each required module. It receives the module and the relative filename. It's return value replaces `module` in the set of results.
