import { Subject } from 'rxjs';

class DataBrokerService {
  #counterData = new Map();
  #counterDataProvider$ = null;

  constructor() {
    //TODO - uitbreiden
    this.#counterDataProvider$ = new Subject();
  }

  /**
   * counterUpdate
   * 
   * Function called by a counter component when its value has been changed
   * 
   * @param {String} counterName - The (unique) name of the counter
   * @param {Number} counterValue - The currect value of the counter
   */
  counterUpdate(counterName, counterValue) {
    // Update the map data
    this.#counterData.set(counterName, counterValue)

    

    // Inform all listeners
    this.#counterDataProvider$.next(this.#counterData)
  }

  /**
   * subscribeToCounterData
   * 
   * Called by any component that requires updates when 
   * the value of one of counters in the collection of counters
   * has changed
   * 
   * @param {function} handlerFunction - Function called on change
   * @returns {any} - parameter required for unsubscribing 
   */
  subscribeToCounterData(handlerFunction) {

    return this.#counterDataProvider$.subscribe(handlerFunction)
  }

  /**
   * unsubscribeFromCounterData
   * 
   * Called by any component that has been subscribed to the counterData
   * but is no longer interested in this data 
   * 
   * @param {any} observer - parameter received from subscription
   */
  unsubscribeFromCounterData(observer) {
    observer.unsubscribe()
  }
}

export const dataBrokerService = new DataBrokerService()