Modules 101
===========

A quick guide to understanding and making modules in Node.js.

By [Nizar](https://github.com/khalifenizar).

----

Modules 101
===========

Let's go through this quickly because together we are going to do a special activity.


---


Modules *are* Node.js
---------------------

Node's design [relies heavily on "userland"](https://github.com/joyent/node/wiki/node-core-vs-userland) -- user modules.

----

Modules *are* Node.js
---------------------

The standard library (a.k.a. node-core) is a very minimal set of building blocks.

----

Modules *are* Node.js
---------------------

This empowers *the community*, that is to say us, to participate in a big way.

----

Modules *are* Node.js
---------------------

By writing modules and publishing them for the whole community on...


---


[npm](https://www.npmjs.org/)
-----------------------------

The giant registry for user modules for Node.js (and other things too).

----

[npm](https://www.npmjs.org/)
-----------------------------

This is awesome because we, *the community*, have made a ton of modules.

----

[npm](https://www.npmjs.org/)
-----------------------------

Need a function that does a thing? If it's not already made, make it!

----

[npm](https://www.npmjs.org/)
-----------------------------

Hell, if it's already made make it anyway! It's easy!

----

[npm](https://www.npmjs.org/)
-----------------------------

How easy is it?


---


It's really really easy
-----------------------

Two weeks ago I had *zero* modules in `npm`.

----

It's really really easy
-----------------------

Now I have [two whole modules](https://www.npmjs.org/~khalifenizar)!

----

It's really really easy
-----------------------

*It's so easy*, in fact, that we are about to make one and publish it to `npm`.


---


That's right. You. Me. Us.
--------------------------


---


<('.'<) (>'.')> <('.'<)
-----------------------

Who knows what this is?


---


kirby-dance
-----------

We are making it.

----

kirby-dance
-----------

Here's what I want it to look like:

```js
var kirbyDance = require('kirby-dance');

console.log(kirbyDance(4)); // "<('.'<) (>'.')> <('.'<) (>'.')>"
```


---


Module basics
-------------

Before coding, let's go over some basics.

----

Module basics
-------------

A *module* is a file that contains a piece of code (ideally small and self-contained) that can be pulled into a program.

----

Module basics
-------------

In Node.js, programs use the `require()` function to pull in modules.

```js
// Your program

var thing = require('./thing');
```

----

Module basics
-------------

Modules use `exports` or `module.exports` to make things available.

```js
// thing.js module

function thing () {
    // do things
}

module.exports = thing;
```

----

Module basics
-------------

The things you make available can be anything that you can store in a JavaScript variable!

- objects
- functions
- prototypes (i.e. constructor/class equivalent in JavaScript)
- arrays
- numbers
- strings
- whatever!


---


require
-------

The `require()` function can pull in modules from three different places.

----

require
-------

[Node core](http://nodejs.org/api/):

```js
var crypto = require('crypto'),
    http = require('http'),
    fs = require('fs')
;
```

----

require
-------

Files and folders (automatically adds the `.js` extension):

```js
var thing = require('./thing'),                // ./thing.js
    arrayStuff = require('./stuff/array'),     // ./stuff/array.js
    stuff = require('./stuff'),                // ./stuff/index.js
    up = require('../up'),                     // ../up.js
    absolute = require('/usr/nizar/absolute')  // /usr/nizar/absolute.js
;
```

----

require
-------

The `node_modules` directory (where `npm` puts modules):

```bash
npm install moment
npm install chalk
```

```js
var moment = require('moment'),
    chalk = require('chalk')
;
```

----

require
-------

The `require()` function caches the value of `module.exports`.

```js
// thing.js

var thing = {};
thing.greeting = 'o hai';

module.exports = thing;
```

```js
// Your program

var thing1,
    thing2
;

thing1 = require('./thing');
thing1.greeting = 'Hello, sir.';

thing2 = require('./thing');
console.log(thing2.greeting); // "Hello, sir."
```


---


Let's get to coding...
----------------------


---


Good job!
---------

Now help me make it better! Send me some pull requests!


---

Modules 101
===========

[Thanks for listening!](https://www.npmjs.org/~khalifenizar)
------------------------------------------------------------
