# require-array
> A node.js require utility to save on boilerplate code.

[![Coverage Status](https://coveralls.io/repos/StickyCube/require-array/badge.svg?branch=master&service=github)](https://coveralls.io/github/StickyCube/require-array?branch=master)

[![Build Status](https://travis-ci.org/StickyCube/require-array.svg?branch=master)](https://travis-ci.org/StickyCube/require-array)

### Description
require-array is a simple utility for bulk requiring entire directories into a single array using glob patterns.

```javascript

// routes/middleware/index.js
var requireArray = require('require-array');

var inject = function (mod) {
  return mod({ router: router, db: database });
};

requireArray('middleware/login/*.js', 'middleware/**/*.js', '!**/private/not-this.js', { resolve: inject });

app.use('*', router)

```

## API

### requireArray([path, [path, ...]], [options]);

* path - String [default = `'./*.js'`] - Specify as many relative paths as you want to require files from. Exclusions can be set by prefixing with `!`.
* options - Object - augment the behavior (see options section below)

### Options

#### `options.resolve - Function (module, filename)`
the resolve callback is invoked for each required module. It receives the module and the relative filename. It's return value replaces `module` in the set of results.
