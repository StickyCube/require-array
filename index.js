'use strict';

var _ = require('underscore');
var glob = require('glob');
var path = require('path');
var basepath = path.dirname(module.parent.filename);
var basefile = path.basename(module.parent.filename);

// Clear out the require cache so we get the correct module.parent file
delete require.cache[__filename];

function identity (val) {
  return val;
}

function toArray (args) {
  return Array.prototype.slice.call(args);
}

/**
 * Simple class to represent a file
 * @param {string} filepath the relative file path
 */
function File (filepath) {
  if (!(this instanceof File)) return new File(filepath);
  this.relative = filepath;
  this.absolute = path.join(basepath, filepath);
}

/**
 * Set initial odefault options
 * @param  {object} opt
 * @return {object}
 */
function options (opt) {
  opt = opt || {};

  // support sending aditional options to glob
  opt.glob = opt.glob || {};

  opt.glob.cwd = basepath;

  // set the default resolver to identity
  if (!_.isFunction(opt.resolve)) {
    opt.resolve = identity;
  }

  return opt;
}

/**
 * Sort function to ensure any patterns starting with a '!' character are
 * processed last
 * @param  {string} a
 * @param  {string} b
 * @return {number}
 */
function sort (a, b) {
  var negateA = a.charAt(0) === '!';
  var negateB = b.charAt(0) === '!';

  if (negateA === negateB) {
    return 0;
  }

  return negateA ? 1 : -1;
}

/**
 * Remove invalid results from glob matches
 * @param  {string} filename
 * @return {boolean}
 */
function filter (filename) {
  if (filename === basefile) {
    // prevent recursive require
    return false;
  }

  if (filename.indexOf('node_modules') > -1) {
    // don't require node modules
    return false;
  }

  // only require .js and .json files
  return /\.js(?:on)?$/.test(filename);
}

/**
 * Normalise a file name.
 * used primarially to strip leading './' from file names
 * @param  {string} filename
 * @return {string}
 */
function normalize (filename) {
  // strip leading './' from relative filepaths
  return path.normalize(filename);
}

/**
 * Combine the results of multiple glob patterns into a single unique array.
 * Globs starting with a '!' character are pushed to the end to filter the
 * final result.
 * @param  {string[]} patterns  An array of glob patterns to combine
 * @param  {object} opt         The options object
 * @return {File[]}             An array of Files representing the matched set
 */
function walk (patterns, opt) {
  return patterns.sort(sort).reduce(function (files, pattern) {
    var negate = pattern.charAt(0) === '!';
    var found;

    if (negate) {
      // chop of the leading '!'
      pattern = pattern.substring(1);
    }

    // grab all the files
    found = glob
      .sync(pattern, opt.glob)
      .map(normalize)
      .filter(filter);

    if (negate) {
      // omit the files if they already exist in the matched set
      return _.difference(files, found);
    }

    // compose a unique array of file names
    return _.union(files, found);
  }, []).map(File);
}

/**
 * Get an iterator wich will require and invoke the resolver for this module
 * @param  {options} opts the options object
 * @return {Any}
 */
function resolve (opts) {
  return function (file) {
    var obj = require(file.absolute);
    return opts.resolve(obj, file.relative);
  };
}

module.exports = function requireall () {
  var args = toArray(arguments);
  var patterns = args.filter(_.isString);
  var opts = _.last(args);

  var resolver;
  var files;

  if (!_.isObject(opts)) {
    opts = null;
  }

  if (!patterns.length) {
    patterns.push('./*.js');
  }

  opts = options(opts);

  files = walk(patterns, opts);

  resolver = resolve(opts);

  return files.map(resolver);
};
