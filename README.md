beautify-with-words
===================

`beautify-with-words` beautifies javascript and replaces variable names with unique "long-ish words". It uses [UglifyJS2](https://github.com/mishoo/UglifyJS2)'s beautifier, but uses a phonetic word generator to rename variables. This makes it <del>easier</del> less-hard to read unminified code and do things like search-and-replace.


### Installation ###
With [`npm`](http://npmjs.org/) as a global package:

```bash
{sudo} npm install -g beautify-with-words
```

### Usage ###

```
beautify-with-words [input_file.js] [options]
```

`beautify-with-words` takes one file at a time – or, if no input file is specified, then input is read from `STDIN`.

* Use the `-o` / `--output` option to specify an output file. By default, the output goes to `STDOUT`;
* Use the `-b` / `--beautify` to pass UglifyJS2 [beautifier options](https://github.com/mishoo/UglifyJS2#beautifier-options);
* And `-h` / `--help` for help.

Reading from, and saving to, a file:

```
beautify-with-words backbone-min.js -o backbone-youre-beautiful-regardless.js
```

Send the output to `STDOUT`, and turn off syntax _beatification_ but keep variable renaming:

```
beautify-with-words backbone-min.js -b beautify=false
```

Tell the beautifier to always insert brackets in `if`, `for`, `do`, `while` or `with` statements. Go [here](https://github.com/mishoo/UglifyJS2#beautifier-options) for more options.

```
beautify-with-words backbone-min.js -b bracketize=true
```


### Sample ###

This:

```bash
curl http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min.js | beautify-with-words
```

Turns this:

```js
// stuff...
if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},
// more stuff...
```

Into this:

```js
// stuff...
    if (!quinis && typeof require !== "undefined") quinis = require("underscore");
    tenmiey.$ = deegip.jQuery || deegip.Zepto || deegip.ender || deegip.$;
    tenmiey.noConflict = function() {
        deegip.Backbone = upan;
        return this;
    };
    tenmiey.emulateHTTP = false;
    tenmiey.emulateJSON = false;
    var koken = tenmiey.Events = {
        on: function(bedad, latay, vublu) {
            if (!adag(this, "on", bedad, [ latay, vublu ]) || !latay) return this;
            this._events || (this._events = {});
            var cyem = this._events[bedad] || (this._events[bedad] = []);
            cyem.push({
                callback: latay,
                context: vublu,
                ctx: vublu || this
            });
            return this;
        },
        once: function(nodu, flakou, nura) {
            if (!adag(this, "once", nodu, [ flakou, nura ]) || !flakou) return this;
            var neri = this;
            var lopo = quinis.once(function() {
                neri.off(nodu, lopo);
                flakou.apply(this, arguments);
            });
            lopo._callback = flakou;
            return this.on(nodu, lopo, nura);
        },
// more stuff...
```
