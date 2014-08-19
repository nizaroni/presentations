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


Async Idempotent Writes
=======================

[Thanks for listening!](https://github.com/khalifenizar)
--------------------------------------------------------
