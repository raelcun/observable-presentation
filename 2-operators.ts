import { CancellationFunction, DataGenerator, IObserver, noop } from './types'
import { createConsoleObserver, test } from './logLib'

export class Observable2<T> {
  public static just<T>(e: T) {
    return new Observable2<T>(observer => {
      observer.next(e)
      observer.complete()
      return noop
    })
  }

  public static fromArray<T>(array: T[]) {
    return new Observable2<T>(observer => {
      array.forEach(val => observer.next(val))
      observer.complete()
      return noop
    })
  }

  public static fromEvent(element: EventTarget, event: string) {
    return new Observable2(observer => {
      const handler: EventListener = e => observer.next(e)
      element.addEventListener(event, handler)
      return () => element.removeEventListener(event, handler)
    })
  }

  public static fromPromise<T>(promise: Promise<T>) {
    return new Observable2(observer => {
      console.log('evaluating promise')
      promise
        .then(val => {
          observer.next(val)
          observer.complete()
        })
        .catch(e => {
          observer.error(e)
          observer.complete()
        })
      return noop
    })
  }

  constructor(private generator: DataGenerator<T>) {}

  public subscribe(observer: IObserver<T>): CancellationFunction {
    return this.generator(observer)
  }

  public map<U>(projection: (e: T) => U) {
    return new Observable2<U>(observer => {
      return this.subscribe({
        next: val => observer.next(projection(val)),
        error: e => observer.error(e),
        complete: () => observer.complete(),
      })
    })
  }

  public mergeMap<U>(projection: (e: T) => Observable2<U>) {
    return new Observable2<U>(observer => {
      return this.subscribe({
        next: val =>
          projection(val).subscribe({
            next: observer.next,
            error: observer.error,
            complete: noop,
          }),
        error: e => observer.error(e),
        complete: () => observer.complete(),
      })
    })
  }
}

const tests = {
  1: () =>
    test('Observable.just', async () => {
      Observable2.just([1, 2, 3]).subscribe(createConsoleObserver())
    }),
  2: () =>
    test('Observable.fromPromise resolution', () => {
      Observable2.fromPromise(Promise.resolve('promise succeeded')).subscribe(createConsoleObserver())
    }),
  3: () =>
    test('Observable.fromPromise rejection', () => {
      Observable2.fromPromise(Promise.reject('promise rejection')).subscribe(createConsoleObserver())
    }),
  4: () =>
    test('Putting it all together', () => {
      Observable2.fromArray([1, 2, 3])
        .mergeMap(val => Observable2.fromArray([val - 1, val, val + 1]))
        .map(val => 'n = ' + val)
        .subscribe(createConsoleObserver())
    }),
}

if (process.argv[1].endsWith('2-operators.ts')) {
  // @ts-ignore
  tests[process.argv[2]]()
}
