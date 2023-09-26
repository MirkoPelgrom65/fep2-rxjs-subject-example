import { LitElement, css, html } from 'lit'
import { dataBrokerService } from '../services';

export class CounterTotalView extends LitElement {

  static get properties() {
    return {
      /** The number of times the button has been clicked. */
      total: { type: Number },
    }
  }

  constructor() {
    super()
    this.total = 0;
  }

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

  disconnectedCallback() {
    dataBrokerService.unsubscribeFromCounterData(this.observer)
    super.disconnectedCallback()
  }

  render() {
    return html`
      <h1>Counter Total</h1>
      <div class="card">
        <div>${this.total}</div>
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

window.customElements.define('counter-total-view', CounterTotalView)