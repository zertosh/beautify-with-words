#!/usr/bin/env node

'use strict';

var fs = require('fs');
var phonetic = require('phonetic');
var UglifyJS = require('uglify-js');

var argv = require('optimist')
  .usage('Beautify javascript with unique \"long-ish words\" for variable names.\n' +
         'https://github.com/zertosh/beautify-with-words\n\n' +
         'Usage $0 [input_file.js] [options]\n\n' +
         'If input file is omitted, then input will be read from STDIN.')
  .alias('b', 'beautify')
  .alias('o', 'output')
  .alias('h', 'help')
  .describe('b', 'Option to pass to UglifyJS2\'s beautifier. (https://github.com/mishoo/UglifyJS2#beautifier-options).')
  .describe('o', 'Output file (default STDOUT).')
  .describe('h', 'This help.')
  .check(function(argv) {
    if (argv._.length > 1) throw 'Error: too many filenames.';
    if (argv.h) throw '';
  })
  .argv;


// Default options to pass to the beautifier
var beautifyOptions = {
  beautify: true
};


// Format options to pass to the beautifier
if (argv.b) {
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


// Read contents
var contents = '';
if (argv._.length === 0) {
  // Read from STDIN
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  process.stdin.on('data', function (buf) {
      contents += buf.toString();
  });
  process.stdin.on('close', function () {
      processContents(contents);
  });
} else {
  // Read from file
  try {
    contents = fs.readFileSync(argv._[0], { encoding: 'utf8' });
    processContents(contents);
  } catch(e) {
    console.error('Failed to open file "%s."', argv._[0]);
    process.exit(1);
  }
}


function processContents(contents) {
  // "Mangle" names
  var ast;
  try {
    ast = UglifyJS.parse(contents);
    ast.figure_out_scope();
    ast.mangle_names();
  } catch(err) {
    console.error('Error: %s\nLine: %d\nCol: %d', err.message, err.line, err.col);
    process.exit(1);
  }

  // Beautify
  var stream = UglifyJS.OutputStream(beautifyOptions);
  ast.print(stream);

  // Output
  if (typeof argv.o === 'string') {
    // Write to file
    try {
      fs.writeFileSync(argv.o, stream.toString(), { encoding: 'utf8' });
    } catch(e) {
      console.error('Failed to write to file "%s."', argv.o);
      process.exit(1);
    }
  } else {
    // Write to STDOUT
    console.log( stream.toString() );
  }
}
