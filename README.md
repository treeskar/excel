Before talk about RXJS architecture.


### 1. Subscription (class)

Represents a disposable resource, such as the execution of an Observable. A
Subscription has one important method, `unsubscribe`, that takes no argument
and just disposes the resource held by the subscription.

Additionally, subscriptions may be grouped together through the `add()`
method, which will attach a child Subscription to the current Subscription.
When a Subscription is unsubscribed, all its children (and its grandchildren)
will be unsubscribed as well.

- _unsubscribe callback 
- closed: boolean - indicates weather subscriptions is closed or not 
- _subscriptions - list of child subscriptions
- add
- remove
- unsubscribe

### 2. Observer (interface)

An interface for a consumer of push-based notifications delivered by an Observable.

- next
- error
- complete

### 3. Subscriber extends Subscription 
Implements the {@link Observer} interface and extends the
{@link Subscription} class. While the {@link Observer} is the public API for
consuming the values of an {@link Observable}, all Observers get converted to
a Subscriber, in order to provide Subscription-like capabilities such as
`unsubscribe`. Subscriber is a common type in RxJS, and crucial for
implementing operators, but it is rarely used as a public API.
 

- destination - observer
- next
- error
- complete

### 4. Observable (class)
- constructor (function) - producer 
- _subscribe - subscribe callback
- subscribe 
- pipe - reduce operator(observable)

### 5. Observable function

A representation of any set of values over any amount of time.
This is the most basic building block of RxJS.

#### of 
@param ...args
@returns new Observable
in subscribe callback (producers)
gets subscriber and emit all args

#### range
@param start, count
@return new Observable
for in range
and then complete

#### fromEvent
@param target, eventName
@return new Observable
create new Subscription and add it to subscriber

#### merge
@param ...observables
@return new Observable
forEach on observable and add subscription to subscriber

### 6. operators

#### map

@param projection function
@return function that gets observable and returns observable

mapOperator use try/catch

#### filter


### 7. Subject

A Subject is a special type of Observable that allows values to be 
multicasted to many Observers. Subjects are like EventEmitters.

Every Subject is an Observable and an Observer.
You can subscribe to a Subject, and you can call next to feed values as well as error and complete.


### 8. Scheduler

A Scheduler lets you define in what execution context will an Observable deliver notifications to its Observer.
