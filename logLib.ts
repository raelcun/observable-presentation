import { IObserver } from './types'

export const createConsoleObserver = <T>(): IObserver<T> => ({
  next: (e) => console.log(e),
  error: (err) => console.log('error:', err),
  complete: () => console.log('completed'),
})

export const test = (testName: string, cb: () => void) => {
  console.log('\n==>Start Test', testName)
  cb()
}
