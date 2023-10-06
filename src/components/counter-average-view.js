import { LitElement, css, html } from 'lit'
import { dataBrokerService } from '../services';

/**
 * View that displays the Average value of a collection of counters.
 * The view is a data consumer of the dataBrokerService
 */
export class CounterAverageView extends LitElement {
  
  static get properties() {
    return {
      /** The number of times the button has been clicked. */
      average: { type: Number },
    }
  }

  constructor() {
    super()
    this.average = 0;
  }

  /**
   * WebComponent callback function
   * Called when the component is added to the DOM 
   */
  connectedCallback() {
    super.connectedCallback()
    // Subscribe to the dataBrokerService
    this.observer = dataBrokerService.subscribeToCounterData(
      counterMap => {
        // reset totalValue
        let total = 0;
        // For each element in the Map add the value to the totalValue
        counterMap.forEach((value, key) => {
          total += value
        })

        // Devide the total value with the number of counters
        if (counterMap.size > 0) {
          this.average = total / counterMap.size
        } else {
          this.average = 0
        } 
      }
    )
  }

  /**
   * WebComponent callback function
   * Called when the component is removed from the DOM 
   */
  disconnectedCallback() {
    // Unsubscribe from the service
    dataBrokerService.unsubscribeFromCounterData(this.observer)
    super.disconnectedCallback()
  }

  /**
   * LitElement callback function
   * Called whenever a property has been changed
   */
  render() {
    return html`
      <h1>Counter Average</h1>
      <div class="card">
        <div>${this.average}</div>
      </div>
    `
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }
      `
  }
}

window.customElements.define('counter-average-view', CounterAverageView)