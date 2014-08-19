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


Async Idempotent Writes
=======================

[Thanks for listening!](https://github.com/khalifenizar)
--------------------------------------------------------
