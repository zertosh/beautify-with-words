/*global describe, it, before, beforeEach, after, afterEach */

require('should');

describe('beautifyWithWords', function() {

  var beautifyWithWords = require('../');

  it('before and after should be different', function() {
    var fs = require('fs');
    var nestedReturnAsString = fs.readFileSync(__dirname + '/fixtures/nestedReturn.js', { encoding: 'utf8' });

    beautifyWithWords(nestedReturnAsString).should.not.equal(nestedReturnAsString);
  });

  it('before and after code should evaluate the same way', function() {
    var fs = require('fs');
    var nestedReturnAsFunction = require('./fixtures/nestedReturn');
    var nestedReturnAsString = fs.readFileSync(__dirname + '/fixtures/nestedReturn.js', { encoding: 'utf8' });

    // Fake a "module" creation by eval'ing the return value from beautifyWithWords
    var nestedReturnRevivied = (function() {
      // jshint -W054
      var module = {};
      (new Function(
        'var module = arguments[0];\n' +
        beautifyWithWords(nestedReturnAsString)
      ))(module);
      return module.exports;
    })();

    nestedReturnAsFunction('cats').should.equal( nestedReturnRevivied('cats') );
  });

});
