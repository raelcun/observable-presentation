import { Observable, range } from 'rxjs'
import { interval, of, throwError } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { mergeMap, retry } from 'rxjs/operators'
import { createConsoleObserver, test } from './logLib'

const tests = {
  1: () =>
    test('range factory', () => {
      range(1, 50).subscribe(createConsoleObserver())
    }),
  2: () =>
    test('pipe operator', () => {
      range(1, 20)
        .pipe(
          map(e => e + 100),
          filter(e => e % 2 === 0),
        )
        .subscribe(createConsoleObserver())
    }),
  3: () =>
    test('custom operator', () => {
      type Operator = <T, U>(source: Observable<T>) => Observable<U>

      const takeEveryNth = (n: number) => <T>(source: Observable<T>) =>
        new Observable<T>(observer => {
          let count = 1
          return source.subscribe({
            next: x => {
              if (count++ % n === 0) {
                observer.next(x)
              }
            },
            error: err => {
              observer.error(err)
            },
            complete: () => {
              observer.complete()
            },
          })
        })

      range(1, 20)
        .pipe(takeEveryNth(3))
        .subscribe(createConsoleObserver())
    }),
  4: () =>
    test('simpler custom operators', () => {
      const takeEveryNth = (n: number) => <T>(source: Observable<T>) =>
        source.pipe(filter((value, index) => (index + 1) % n === 0))

      range(1, 20)
        .pipe(takeEveryNth(3))
        .subscribe(createConsoleObserver())
    }),
  5: () =>
    test('retry operator', () => {
      const source = interval(1000)
      const example = source.pipe(
        mergeMap(val => {
          if (val > 2) {
            return throwError('Error!')
          }
          return of(val)
        }),
        retry(2),
      )

      example.subscribe(createConsoleObserver())
    }),

  /* Learn important operators
   * https://www.learnrxjs.io/
   * http://rxmarbles.com/
   *
   * Combination
   *** combineLatest
   *** race
   *** merge
   *** pairwise
   *** zip
   *
   * Creation
   *** empty
   *** interval
   *** of
   * Error Handling
   *** catchError
   *** retry
   *
   * Multicasting
   *** publish
   *** share
   *** simply explain hot and cold observables then move on
   *
   * Filtering
   *** debounce
   *** distinctUntilChanged
   *** filter
   *** throttleTime
   *
   * Transformation
   *** buffer
   *** map
   *** flatMap
   *** reduce
   *** switchMap
   *
   * Utility
   *** do/tap
   */
}

if (process.argv[1].endsWith('4-rxjs.ts')) {
  // @ts-ignore
  tests[process.argv[2]]()
}
