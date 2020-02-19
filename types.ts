export interface IObserver<T> {
  next: (e: T) => void
  error: (e: Error) => void
  complete: () => void
}

export interface IObservable<T> {
  subscribe: (obs: IObserver<T>) => CancellationFunction,
}

export type CancellationFunction = () => void

export type DataGenerator<T> = (obs: IObserver<T>) => CancellationFunction

// tslint:disable-next-line:no-empty
export const noop = () => {}
