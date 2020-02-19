import { CancellationFunction, DataGenerator, IObserver, noop } from './types'
import { createConsoleObserver, test } from './logLib'

export class Observable1<T> {
  public static fromArray<T>(array: T[]) {
    return new Observable1<T>(observer => {
      console.log('looping through array')
      array.forEach(val => observer.next(val))
      observer.complete()
      return noop
    })
  }

  constructor(private generator: DataGenerator<T>) {}

  public subscribe(observer: IObserver<T>): CancellationFunction {
    return this.generator(observer)
  }
}

const tests = {
  1: () =>
    test('Observable.fromArray', () => {
      Observable1.fromArray([1, 2, 3]).subscribe(createConsoleObserver())
    }),
  2: () =>
    test('What if I don\'t subscribe?', () => {
      Observable1.fromArray([1, 2, 3])
    }),
  3: () =>
    test('Custom observer', () => {
      new Observable1<number>(observer => {
        observer.next(2)
        observer.next(4)
        observer.next(6)
        observer.complete()
        return noop
      }).subscribe(createConsoleObserver())
    }),
}

if (process.argv[1].endsWith('1-basics.ts')) {
  // @ts-ignore
  tests[process.argv[2]]()
}
