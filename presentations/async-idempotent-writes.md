Async Idempotent Writes
=======================

How I composed writes to the same collection from multiple sources in *unpredictable* order in [MongoDB](http://www.mongodb.org/).

By [Nizar](https://github.com/khalifenizar).

----

Async Idempotent Writes
=======================

I'm going to talk about an API project that presented me with certain problems.

----

Async Idempotent Writes
=======================

After we get an understanding of the problems, we will talk about what I mean by `asynchronous` and `idempotent` database writes.

----

Async Idempotent Writes
=======================

Finally, we will see some of the patterns I used to solve those problems.

----

Async Idempotent Writes
=======================

Please interrupt me if you have any questions or if I say something stupid!


---


The Lola API
------------

For most of 2014, I worked on an API, which we called **Lola**, that dealt in World Cup data.

----

The Lola API
------------

We called it **Lola** because like with a *lady of the night*, the client wanted to throw everything they could think of in there.

----

The Lola API
------------

Anyway, we used a service called [DataFactory](http://www.datafactory.la/en/) to provide us with the match data.

----

The Lola API
------------

To process the data, we had a bunch of *worker processes* that made requests to the API and saved the data to our MongoDB instance.

----

The Lola API
------------

The worker processes also had... *colorful* names.

![Lola worker names](images/async-idempotent-writes/workers.png)

----

The Lola API
------------

Of course, the DataFactory API structure didn't exactly match the one that I wanted to expose. Which leads us to...


---


The Problems
------------

----

Problem #1: Stitching together data
-----------------------------------

Since the DataFactory API structure was different, I had to stitch together my collections' object data from multiple calls to their API.

----

Problem #1: Stitching together data
-----------------------------------

For example, to assemble data for a match I needed to call:

 - The match calendar API for general information
 - The single match API for team rosters and formations for that match
 - The past World Cup championship APIs for World Cup history between the two teams and World Cup wins

----

Problem #1: Stitching together data
-----------------------------------

```
        +------------+       +-------------+       +-------------+
        |            |       |             |       |             |
        | API: match |       | API: single |       | API: World  |
        |  calendar  |       |    match    |       | Cup history |
        |            |       |             |       |             |
        +-----+------+       +------+------+       +------+------+
              |                     |                     |
              +-----------------+   |   +-----------------+
                                |   |   |
                      +---------v---v---v---------+
                      |                           |
                      | { _id: <ObjectId1>, ... } |
                      |                           |
                      +---------------------------+
                        match document
```

----

Problem #1: Stitching together data
-----------------------------------

Our writes needed to be constructed in such a way that they would *never unintentionally undo* the data of a previous write.

----

Problem #2: Unpredictable order
-------------------------------

We made a decision to have workers handle each API call in isolation.

----

Problem #2: Unpredictable order
-------------------------------

This means that we would have no guarantees as to the order in which our writes would be made.

----

Problem #2: Unpredictable order
-------------------------------

So we needed to figure out a way to make sure our writes performed their desired effect *no matter the order* in which they were run.

----

Problem #2: Unpredictable order
-------------------------------

```
                  +---------+     +---------+     +---------+
                  | write a +-----> write b +-----> write c |
                  +---------+     +---------+     +---------+

                              needs to result in
                             the same document as:

                  +---------+     +---------+     +---------+
                  | write c +-----> write a +-----> write b |
                  +---------+     +---------+     +---------+
```

----

Problem #3: Redundant writes
----------------------------

Another architectural decision we made was to have our workers be *stateless*.

----

Problem #3: Redundant writes
----------------------------

By *stateless* I mean that when they started up they would make no assumptions about what was going on before they started.

----

Problem #3: Redundant writes
----------------------------

So the workers would assume that they had to crunch all the data and write blindly, which potentially would lead to *redundant writes*.

----

Problem #3: Redundant writes
----------------------------

In other words, we had to make sure that we wouldn't get *duplicate or incorrect* data if the writes were performed multiple times.

----

Problem #3: Redundant writes
----------------------------

We don't want this:

```
                                +---------------------+
                                |                     |
                                |  +------------+     |
                +---------+     |  |            |     |
                | write a +----->  | document a |     |
                +---------+     |  |            +--+  |
                +---------+     |  +--+---------+  |  |
                | write a +----->     | document a |  |
                +---------+     |     |            |  |
                                |     +------------+  |
                                |                     |
                                +---------------------+
                                      collection
```

----

Problem #3: Redundant writes
----------------------------

We *do* want this:

```
                                  +------------------+
                  +---------+     |                  |
                  | write a +----->  +------------+  |
                  +---------+     |  |            |  |
                                  |  | document a |  |
                  +---------+     |  |            |  |
                  | write a +----->  +------------+  |
                  +---------+     |                  |
                                  +------------------+
                                      collection
```

----

The Problems
------------

Now it's time for some $5 words.


---


Asynchronous
------------

We all know this one.

----

Asynchronous
------------

Asynchronous things happen in the background, take a variable amount of time and finish in unpredictable order.

----

Asynchronous
------------

Our writes happen in different chunks, at any time and in unpredictable order, so our writes are definitely *asynchronous*.


---


Idempotent
----------

An operation is said to be [*idempotent*](http://en.wikipedia.org/wiki/Idempotence) if it can be applied multiple times without changing the result beyond the first application.

----

Idempotent
----------

An easy example of this concept is a `remove` operation:

```js
db.collection.remove({ _id: 9999 });
```

----

Idempotent
----------

No matter how many times you `remove` document `9999`, you will get the same result: a collection without document `9999`.

----

Idempotent
----------

To handle our redundant writes, we need to make sure that our writes are idempotent just like a `remove` would be.


---


Patterns
--------

Let's go into some of the patterns we used to solve our problems.


---


Updates with `$set`
-------------------

First and foremost, we needed to perform our updates with surgical precision using [`$set`](http://docs.mongodb.org/manual/reference/operator/update/set/#up._S_set).

----

Updates with `$set`
-------------------

This way, a write would only modify what it cares about and nothing else:

```js
db.matches.update(
    { id: 9999 },
    { $set: {
        id: 9999,
        status: 'scheduled',
        startDate: '2014-06-13T18:00Z',
        stadium: { ... },
        teams: {
            home: { ... },
            away: { ... }
        },
        ...
    }}
);
```

----

Updates with `$set`
-------------------

We often had to break apart sub-document properties using [*dot notation*](http://docs.mongodb.org/manual/core/document/#dot-notation) for even greater precision:

```js
db.matches.update(
    { id: 9999 },
    { $set: {
        'teams.home.roster': { ... },
        'teams.home.formation': { ... },
        'teams.away.roster': { ... },
        'teams.away.formation': { ... },
        ...
    }}
);
```

----

Updates with `$set`
-------------------

When you use `$set`, you can have documents composed from multiple different writes that are concerned with different data fields.

----

Updates with `$set`
-------------------

Additionally, the order in which you perform the writes doesn't matter as long as you use *dot notation* for the sub-documents.

----

Updates with `$set`
-------------------

These writes are also *idempotent* because no matter how many times you `$set` these fields, the end result is a document with the set fields containing those values.

----

Updates with `$set`
-------------------

Therefore this pattern helps us with **problems #1, #2 and #3**.

----

Updates with `$set`
-------------------

The hidden advantage of this approach was that we could safely pull object data updates from the source, like last-minute `stadium` changes.


---


The `processed` pattern
-----------------------

The `processed` pattern is a way I devised for documents to keep update state internally.

----

The `processed` pattern
-----------------------

There may be better ways to achieve this, like having a dedicated aggregation pipeline worker to crunch numbers for you.

----

The `processed` pattern
-----------------------

It consists of having a field in the document indicates which things it's already processed. In our case the processed things were past World Cups:

```js
// team document
{
    id: 9999,
    name: 'Spain'
    championshipWins: 1,
    processedHistory: [
        'brasil-2014',
        'south-africa-2010',
        'germany-2006'
    ]
}
```

----

The `processed` pattern
-----------------------

Now we can construct an *idempotent* write using that field with a [`$nin`](http://docs.mongodb.org/manual/reference/operator/query/nin/#op._S_nin) as part of our query:

```js
db.teams.update(
    {
        id: 9999,
        processedHistory: { $nin: [ 'south-africa-2010' ] }
    }, {
        $inc: { championshipWins: 1 },
        $addToSet: { processedHistory: 'south-africa-2010' }
    }
);
```

----

The `processed` pattern
-----------------------

In other words, we are incrementing `championshipWins` only if `south-africa-2010` isn't in `processedHistory`.

```js
db.teams.update(
    {
        id: 9999,
        processedHistory: { $nin: [ 'south-africa-2010' ] }
    }, {
        $inc: { championshipWins: 1 },
        $addToSet: { processedHistory: 'south-africa-2010' }
    }
);
```

----

The `processed` pattern
-----------------------

This write should only actually modify the document once! `Idempotence`, baby!

----

The `processed` pattern
-----------------------

The order doesn't matter either. All three problems are considered!


---


Inserts with `upsert`
---------------------

So far we've only discussed updates. The document needs to be inserted into the collection somehow!

----

Inserts with `upsert`
---------------------

Our system was stateless, though. We didn't want to have to worry about if it was inserted or not when we were making our writes.

----

Inserts with `upsert`
---------------------

The `upsert` option helped us in this regard. It allowed us to `update` or `insert` as the case may be:

```js
db.matches.update(
    { id: 9999 },
    { $set: { ... } },
    { upsert: true }
);
```

----

Inserts with `upsert`
---------------------

There were a couple of caveats though...

----

Inserts with `upsert`
---------------------

For one thing, you have to make sure you write any data you are using to query by or you will get duplicates *on every write*.

----

Inserts with `upsert`
---------------------

I got bit by this plenty of times with the `language` field:

```js
db.matches.update(
    {
        language: 'es',
        id: 9999
    },
    { $set: {
        language: 'es',  // forget this at your peril
        id: 9999,
        ...
    }},
    { upsert: true }
);
```

----

Inserts with `upsert`
---------------------

Unfortunately, `upsert` doesn't play well with the `processed` pattern.

----

Inserts with `upsert`
---------------------

Who can tell me why?

```js
db.teams.update(
    {
        id: 9999,
        processedHistory: { $nin: [ 'south-africa-2010' ] }
    }, {
        $inc: { championshipWins: 1 },
        $addToSet: { processedHistory: 'south-africa-2010' }
    },
    { upsert: true }
);
```

----

Inserts with `upsert`
---------------------

If there isn't a document with `id` `9999` and without `south-africa-2010`, it will just create one. *Every single time*.

```js
db.teams.update(
    {
        id: 9999,
        processedHistory: { $nin: [ 'south-africa-2010' ] }
    }, {
        $inc: { championshipWins: 1 },
        $addToSet: { processedHistory: 'south-africa-2010' }
    },
    { upsert: true }
);
```

----

Inserts with `upsert`
---------------------

That isn't so great with problem #2. A document has to be inserted before a `processed` pattern write will work.


---


Async Idempotent Writes
=======================

[Thanks for listening!](https://github.com/khalifenizar)
--------------------------------------------------------
