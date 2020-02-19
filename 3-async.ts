import { Observable2 } from './2-operators'
import { noop } from './types'
import { createConsoleObserver, test } from './logLib'

const createIntervalObservable = (interval: number, timeout = 0) =>
  new Observable2<number>(observer => {
    console.log('evaluating observer')

    let i = 1
    const timer = setInterval(() => {
      observer.next(i++)
    }, interval)

    if (timeout > 0) {
      setTimeout(() => {
        clearInterval(timer)
        observer.complete()
      }, timeout)
    }

    return noop
  })

const tests2 = {
  1: () =>
    test('Interval observable factory example', () => {
      createIntervalObservable(1000, 3000).subscribe(createConsoleObserver())
    }),
  2: () =>
    test('Interval observable factory example without subscribe', () => {
      createIntervalObservable(1000, 3000)
    }),
}

if (process.argv[1].endsWith('3-async.ts')) {
  // @ts-ignore
  tests2[process.argv[2]]()
}
