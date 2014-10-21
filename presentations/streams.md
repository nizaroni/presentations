Node.js Streams
===============

An introduction to streams in Node.js.

By [Nizar](https://github.com/khalifenizar).

----

Node.js Streams
===============

Let's go over the basics of what streams are, why they can be good and why they can be bad.

----

Node.js Streams
===============

Then let's do some [`stream-adventure`](https://www.npmjs.org/package/stream-adventure)!

----

Node.js Streams
===============

Please interrupt me if you have any questions or if I say something totally wrong!

----

Node.js Streams
===============

How many of you are new to Node.js?

----

Node.js Streams
===============

How many of you have used streams before?


---


What's a stream?
----------------

Streams are Node.js' unified interface for I/O.

----

What's a stream?
----------------

They are [part of Node.js core](http://nodejs.org/api/stream.html), Node's standard library.

----

What's a stream?
----------------

A stream can be *readable* (provides data), *writable* (expects data) or *both* (called a *transform* stream).

----

What's a stream?
----------------

Just like when you stream a video, Node.js streams send, receive and operate on data in small chunks at a time.

----

What's a stream?
----------------

They are designed to emulate Unix in that streams can be *piped* together to compose more complex operations.


---


How streams work
----------------

Here's the most basic example of streams in action:

```js
readbleStream.pipe(writableStream);
```

----

How streams work
----------------

But let's look to Unix first to give this a little bit of context.

```js
readbleStream.pipe(writableStream);
```


---


Piping in Unix
--------------

Take the `history` command, for example:

```bash
$ history
```

----

Piping in Unix
--------------

It gives you a huge list of the last commands you've run.

```bash
$ history
```

----

Piping in Unix
--------------

By itself that isn't very useful.

```bash
$ history
```

----

Piping in Unix
--------------

But if we *pipe* that data into another command, say `grep`:

```bash
$ history | grep 'git diff'
```

----

Piping in Unix
--------------

Now we can filter that list into something meaningful.

```bash
$ history | grep 'git diff'
```

----

Piping in Unix
--------------

And we can add even more functionality by adding more pipes:

```bash
$ history | grep 'git diff' | pbcopy
```

----

Piping in Unix
--------------

The `pbcopy` command puts the data it receives on your clipboard. Try pasting!

```bash
$ history | grep 'git diff' | pbcopy
```

----

Piping in Unix
--------------

What we've got here is a *pipeline*: functionality composed together by piping.

```bash
$ history | grep 'git diff' | pbcopy
```
