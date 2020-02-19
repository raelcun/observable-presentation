# Why should I care about Observables?
Simple answer, reactive programming

## What is reactive programming?
> Reactive programming is an asynchronous programming paradigm concerned with data streams and the propagation of change.

> The device location, the system time, a list of entries from the DB/API, user clicks, everything can be a stream of data. Data from different streams can easily be combined and transformed, and in the end processed/observed by the subscribers.

> In reactive programming, Observables emit data, and send it to the subscribers. This can be seen as data being PUSHed in reactive programming, as opposed to data being PULLed in imperative programming, where you explicitly request data (iterating over collection, requesting data from the DB, etc).

[source](https://medium.com/corebuild-software/why-you-should-learn-reactive-programming-51b6ffc31425)

## Some Advantages
- avoid callbacks
- unified language so much easier to extend
- composition and decomposition is easy
- easier to reason about at a high level (especially for management)
- concept extends into architecture
  - decompose system into events and commands
  - leads into event sourcing