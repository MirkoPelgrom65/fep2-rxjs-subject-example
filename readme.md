**Front End Programming 2**

![hulogo](./assets/hu-logo-nl.svg)


# FEP2 RxJS-Subjects example
Exampe code based on vite standard application that demonstrates the usage of the RxJS class Subject

## RxJS Subject
The RxJS library adds Observables to a javascript project. A Subject is a special kind of Observable. The Front End Programming 2 (FEP2) course contains the concept of Observables. This example demonstrates how a Subject can be used to create code where any number producer components (Lit Elements) multicast their values to any number of consumer components (also Lit Elements).

[RxJS Subject documentation](https://rxjs.dev/guide/subject)

The example is based on the vite default project and build on that code. The code is kept as minimalistic as possible, only focussing on the use of Subjects.

## Vite
Vite is a buid tool that aims to provide a faster and leaner development experience for modern web projects. Vite is the central tool used in the FEP2 course. This example build on the default code provided by Vite when selecting Lit Elements & Javascript as options.

[Vite documentation](https://vitejs.dev/)

The default code provides a LitElement called MyElement that implements a counter component

## Lit Elements
The code is build using Lit Elements. Lit Elements is an expansion on the javascript native Custom Web Components. Lit Elements is the base case element for the FEP2 course.

[Lit documentation](https://lit.dev/)

# The Example
The vite default code provides a single Lit Element, a counter ```<my-element>``` in the file my-element.js. The user can click on a button and the value displayed below the button will increment with each click.

The demonstration will expand the code with the following functionality:
- The MyElement class will notify a data broker that its value has been changed
- Two new components will be created:
   - one displaying the total value of all counters ```<counter-total-view>``` 
   - one the average of all counter values ```<counter-average-view>```
- A databroker will be responsible for the data communication using a Subject

A developer can now use any number of ```<my-element>``` components and any number of the views in the ```index.html``` file without changing any other code.

[!WARNING]  
Each ```<my-element>``` component must have a unique name!!!

# The Example code
As stated above, the code was created using the default example code that vite provides. The ```<my-element>``` component is re-used with very minor additional code. Two new components are created and one service. Each will be discussed below.

[!NOTE]   
The vite example code does NOT create folders for components or services. This has been added to the code and the my-element.js file was moved in the components folder

## DataBrokerService
The DataBrokerService code is located in the services folder in the file data-broker-service.js. 

[!NOTE]   
The DataBrokerService class is NOT exported, but rather the dataBrokerService instance that is created. This effectively creates a singleton. 

```javascript
export const dataBrokerService = new DataBrokerService()
```

### couterUpdate()
The service has the function counterUpdate(). This function can be called by a counter ```<my-element>``` whenever the value changes. The values is stored in #counterData as a Map with the counterName as key. Each counter has its own place in the Map, therefor it does not matter how many counter components the app has.

Next the function will call the Subject.next() function. This will call the subscribed funtion for all consumers of the service. the next() function provides the counterData (Map) as a paramter.

```javascript
  counterUpdate(counterName, counterValue) {
    // Update the map data
    this.#counterData.set(counterName, counterValue)

    // Inform all listeners
    this.#counterDataProvider$.next(this.#counterData)
  }
```

### subscribeToCounterData()
The function subscribeToCounterData(handlerFunction) allows any component to subscribe to the Subject without exposing the subject. Each consumer should call this function and provide a function that needs to be called whenever Subject.next() is called.

unsubscribeFromCounterData() unsubscribes from the service

## MyElement
The MyElement component as two additional lines of code (compoared to the default code). 

```
dataBrokerService.counterUpdate(this.name, this.count)
```

This code is added whenever the counter values changes; in the connectedCallback() and in the _onClick() event handler. The one in the connectedCallback() is needed to provide the initial value.

## CounterTotalView
The CounterTotalView component ```<counter-total-view>``` displays the accumulated values of all counters. It is a LitElement component. 

### connectedCallback
In the connectedCallBack (WebComponent callback, called when the component is added to the DOM) a subscription to the dataBrokerService is made.

In the callbackfunction the map with all counterData is provided by the dataBrokerService. Using a loop all values are added to a toal value (this.total). Since this.total is defined as a property, any change in value will trigger the render function. 

```javascript
  connectedCallback() {
    super.connectedCallback()
    this.observer = dataBrokerService.subscribeToCounterData(
      counterMap => {
        this.total = 0;
        counterMap.forEach((value, key) => {
          this.total += value
        })
      }
    )
  }
```

### render
Whenever a property is changed, the render function is called. The render function simply displays the total value:

```javascript
  render() {
    return html`
      <h1>Counter Total</h1>
      <div class="card">
        <div>${this.total}</div>
      </div>
    `
  }
```

## CounterAverageView
The CounterAverageView is almost identical to the CounterTotalView. The only difference is that the total value is here diveded by the number of counters.

# index.html
All three components are inserted in the DOM in the index.html. It is easy to demonstrate that additional versions of the components can be added. Note that the names of the counter must be unique (otherwise the Map will not function correctly)

```html
  <body>
    <my-element name="Counter 1"></my-element>
    <my-element name="Counter 2"></my-element>

    <counter-total-view></counter-total-view>
    <counter-average-view></counter-average-view>
  </body>
```



