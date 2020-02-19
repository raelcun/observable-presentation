import axios from 'axios'
import { empty, forkJoin, fromEvent, of } from 'rxjs'
import { catchError, debounceTime, filter, map, flatMap, retry, switchMap, withLatestFrom } from 'rxjs/operators'
import { noop } from './types'

const searchBoxValueChanged$ =
  fromEvent(document.getElementById('searchbox'), 'onchange')
    .pipe(
      map(ev => document.getElementById('searchbox').nodeValue),
    )

const searchResults$ = searchBoxValueChanged$.pipe(
  debounceTime(200),
  filter(query => query.length >= 3),
  map(query => axios.get(`https://api.app.com/v1/search?${query}`)),
  retry(2),
)

// render popup notification when errors occur
searchResults$.subscribe(
  noop,
  err => {
    // render notification to user using error message
  },
)

// render search results
searchResults$.pipe(
  catchError(err => empty()),
).subscribe(
  results => {
    // render results
  },
)

searchResults$.subscribe(
  noop,
  err => {
    console.log(err)
  },
)

// BACKEND CODE
interface Customer {
  id: string,
  name: string
}
interface Order {
  id: string,
  customerId: string
}
interface OrderLine {
  id: string,
  orderId: string,
  itemNo: string,
  quantity: number
}
interface HydratedOrder {
  id: string,
  customer: Customer
  lines: OrderLine[]
}

const customers: Customer[] = [
  { id: '1', name: 'Bill' },
  { id: '2', name: 'Bob' },
]
const orders: Order[] = [
  { id: '1', customerId: '1' },
  { id: '2', customerId: '2' },
]
const orderLines: OrderLine[] = [
  { id: '1', orderId: '1', itemNo: 'a', quantity: 2 },
  { id: '2', orderId: '1', itemNo: 'b', quantity: 1 },
  { id: '3', orderId: '2', itemNo: 'c', quantity: 1 },
]

const getCustomer = (id: string): Promise<Customer> => Promise.resolve(customers.find(e => e.id === id) as Customer)
const getOrder = (id: string): Promise<Order> => Promise.resolve(orders.find(e => e.id === id) as Order)
const getOrderLines = (id: string): Promise<OrderLine[]> => Promise.resolve(orderLines.filter(e => e.orderId === id))

const orderSelected$ = of('1')
const selectedOrder$ = orderSelected$.pipe(
  flatMap(orderId => getOrder(orderId)),
  switchMap(order =>
    of(order).pipe(
      withLatestFrom(forkJoin([
        getCustomer(order.customerId),
        getOrderLines(order.customerId),
      ])),
    ),
  ),
  map(([order, [customer, lines]]): HydratedOrder => ({
    id: order.id,
    customer,
    lines,
  })),
)

selectedOrder$.subscribe(hydratedOrder => {
  console.log(hydratedOrder)
})
