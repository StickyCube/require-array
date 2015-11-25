/* global describe beforeEach afterEach it */

'use strict';

var expect = require('chai').expect;
var requireall;
var actual;

describe('require-all', function () {
  beforeEach(function () {
    requireall = require('../index');
  });

  afterEach(function () {
    actual = undefined;
  });

  describe('Default options', function () {
    it('Should require only .js files in the root directory', function () {
      actual = requireall();
      expect(actual).to.have.length(3);
      expect(actual).to.include('file1');
      expect(actual).to.include('file5');
      expect(actual).to.include('file6');
    });
  });

  describe('Targeting one file', function () {
    it('Should require only file_5', function () {
      actual = requireall('file_5.js');
      expect(actual).to.have.length(1);
      expect(actual).to.include('file5');
    });
  });

  describe('Specify more than one pattern', function () {
    it('Should require file_1 and file_6', function () {
      actual = requireall('file_1.js', 'file_6.js');
      expect(actual).to.have.length(2);
      expect(actual[0]).to.equal('file1');
      expect(actual[1]).to.equal('file6');
    });

    it('Should preserve the order', function () {
      actual = requireall('file_6.js', 'file_1.js');
      expect(actual).to.have.length(2);
      expect(actual[0]).to.equal('file6');
      expect(actual[1]).to.equal('file1');
    });
  });

  describe('Ignoring a file', function () {
    it('Should ignore file_5.js from the negated glob', function () {
      actual = requireall('*.js', '!file_6.js');
      expect(actual).to.have.length(2);
      expect(actual).to.include('file1');
      expect(actual).to.include('file5');
    });
  });

  describe('Custom JSON glob', function () {
    it('Should get only .json files in the root directory', function () {
      actual = requireall('*.json');
      expect(actual).to.have.length(1);
      expect(actual).to.include({ name: 'file2' });
    });

    it('Should get .js and .json files in the root directory', function () {
      actual = requireall('*.{js,json}');
      expect(actual).to.have.length(4);
      expect(actual).to.include('file1');
      expect(actual).to.include('file5');
      expect(actual).to.include('file6');
      expect(actual).to.include({ name: 'file2' });
    });
  });

  describe('Require from a subdirectory', function () {
    it('Should require all the .js files in folder1', function () {
      actual = requireall('folder1/*.js');
      expect(actual).to.have.length(2);
      expect(actual).to.include('folder1 file1');
      expect(actual).to.include('folder1 file3');
    });
  });

  describe('Require a nested directory', function () {
    it('Should get all the files in a nested directory', function () {
      actual = requireall('folder3/**/*.js');
      expect(actual).to.have.length(2);
      expect(actual).to.include('folder3 file1');
      expect(actual).to.include('folder3 nested1 file1');
    });

    it('Should get all the files in a deeper nested directory', function () {
      actual = requireall('folder5/**/*.js');
      expect(actual).to.have.length(3);
      expect(actual).to.include('folder5 file1');
      expect(actual).to.include('folder5 nested1 file2');
      expect(actual).to.include('folder5 nested1 nested2 file3');
    });

    it('Should exclude files correctly', function () {
      actual = requireall('folder5/**/*.js', '!folder5/nested1/*.js');
      expect(actual).to.have.length(2);
      expect(actual).to.include('folder5 file1');
      expect(actual).to.include('folder5 nested1 nested2 file3');
    });
  });

  describe('Ignore node_modules', function () {
    it('Should not require files inside node_modules', function () {
      actual = requireall('folder5/**/*.js');
      expect(actual).to.have.length(3);
      expect(actual).not.to.include('folder5 node_modules file4');
    });
  });

  describe('Option - resolve', function () {
    var resolver = function (mod) {
      return mod('Hello');
    };

    it('Should invoke the resolver for each module', function () {
      actual = requireall('folder6/*.js', { resolve: resolver });
      expect(actual).to.have.length(3);
      expect(actual).to.include('folder6 file1 Hello');
      expect(actual).to.include('folder6 file2 Hello');
      expect(actual).to.include('folder6 file3 Hello');
    });
  });
});
