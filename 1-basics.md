# What is an Observable?
An observable is simply, a function that accepts an observer as a parameter and returns a cancellation function. An observer is simply an object with any (or none) of the following functions: next, error, and complete. TLDR; the signature of an observable looks like this:

```ts
type Observer = {
    next?: () => void
    error?: () => void
    complete?: () => void
};

type CancellationFunction = () => void

type Observable = (obs: Observer) => CancellationFunction
```

## Observer Invariants

1. Not having all of the methods implemented is totally cool (as seen in the type definition above)
2. Once `complete` or `error` are called, `next` will never be called
3. Once unsubscribed, nothing should be invoked
4. Calls to `complete` and `error` should unsubscribe
5. If `complete` or `error` throws an exception, you must unsubscribe