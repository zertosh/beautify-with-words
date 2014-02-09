'use strict';

var phonetic = require('phonetic');
var UglifyJS = require('uglify-js');

module.exports = function beautifyWithWords (contents, argv) {

  // Default options to pass to the beautifier
  var beautifyOptions = {
    beautify: true
  };

  // Format options to pass to the beautifier
  if (argv && argv.b) {
    Array.isArray(argv.b) || (argv.b = [ argv.b ]);
    argv.b.forEach(function(option) {
      if (typeof option !== 'string') return;
      option = option.split('=');
      option[0] = option[0].replace(/-/g, '_');
      option[1] = option[1] === 'true'  ? true :
                  option[1] === 'false' ? false :
                  option[1] === 'null'  ? null :
                  !isNaN(option[1])     ? parseInt(option[1]) :
                                          option[1];
      beautifyOptions[option[0]] = option[1];
    });
  }

  // Generate unique phonetic words to be used for variable names.
  // Start with 2 syllable words, once we've somewhat exhausted that
  // space, try 3 syllable words, and so on.
  var getUniqueWord = (function() {
    var options = { capFirst: false, syllables: 2 };
    var used = {};
    var keyCount = 0;
    return function generate() {
      var word = phonetic.generate(options);
      if (!used[word]) {
        used[word] = true;
        return word;
      }
      var currKeyCount = Object.keys(used).length;
      if (currKeyCount === keyCount) {
        keyCount = 0;
        options.syllables++;
      } else {
        keyCount = currKeyCount;
      }
      return generate();
    };
  })();


  // Override `next_mangled` so it returns our words instead.
  // mangle_names() -> mangle() -> next_mangled() in
  // https://github.com/mishoo/UglifyJS2/blob/v2.4.11/lib/scope.js
  UglifyJS.AST_Scope.prototype.next_mangled = function() {
    var next;
    while ((next = getUniqueWord())) {
      if (!UglifyJS.is_identifier(next)) continue;
      return next;
    }
  };

  // "Mangle" names
  var ast;
  try {
    ast = UglifyJS.parse(contents);
    ast.figure_out_scope();
    ast.mangle_names();
  } catch(err) {
    throw err;
  }

  // Beautify
  var stream = UglifyJS.OutputStream(beautifyOptions);
  ast.print(stream);

  return stream.toString();
};
