import {LitElement, html, css} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

/**
 * Poll widget: <poll-widget></poll-widget>.
 * 
 * A web component for a poll widget.
 * It can connect to a remote API to update and request poll results.
 * Poll results are retrieved via a GET request to the URL configured via the "resultsAPI" property 
 * The API response needs to be in the following format:
 * 
 * {
 *      question: 'This is a poll!',
 *      options: [
 *          {
 *              id: 1,                     // Unique id, can be number or string
 *              text: 'This is option 1',  // String representing option text
 *              votes: 500                 // Number representing number of votes for this option
 *          },
 *          ...
 *      ]
 * }
 * 
 * A vote for an option is made via a PATCH request to the URL configured as the "voteAPI" property
 * The request body is the id of the option for which the user voted
 * 
 * @property requestAPI - String. URL for retrieving the results 
 * @property voteAPI - String. URL for casting a vote for user's choice
 * @property width - Number. width of the widget in pixels, if not defined, the width is set to 'auto'
 * @property height - Number. height of the widget in pixels, if not defined, the height is set to 'auto'
 * @property question - String. Question that is being polled
 * @property options - Array. List of options for the question. Array of objects. Each object should have an id and text
 * @property updateFrequency - Number. Minutes after which the poll results should be auto-updated
 * @property orientation - String. "horizontal" or "vertical" to choose bar chart orientation
 * 
 * @fires submit - Indicates when the user submits a vote
 * 
 * @cssproperty --poll-background-color - background color of the poll
 * @cssproperty --poll-color - text color
 * @cssproperty --poll-font-size - text font size
 * @cssproperty --poll-bar-color - color for the bars
 * @cssproperty --poll-vote-color - color for the votes
 */

class PollWidget extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
        }

        :host {
            --background-color: var(--poll-background-color, purple);
        }

        #poll-container {
            background-color: var(--background-color);
            display: flex;
            flex-direction: column;
            padding: 10px;
        }

        h2 {
            margin: 0;
            padding: 15px 0;
        }

        #option-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-evenly;
            margin: 0;
        }

        ol, ul {
            padding: 0;
        }

        li {
            list-style: none;
        }

        #option-content {
            display: flex;
            justify-content: space-between;
        }

        .hide-results .option-text {
            width: 100%;
        }

        .hide-results .option-votes {
            width: 0px;
            overflow: hidden;
        }

        .option-text {
            background-color: #6495ED;
            width: 90%;
        }
    `;

    static properties = {
        _showResults: {state: true},
        requestAPI: {},
        voteAPI: {},
        width: { type: Number },
        height: { type: Number },
        question: {},
        options: { type: Array },
        updateFrequency: { type: Number },
        orientation: {},
    }

    constructor() {
        super();
        this._showResults = false;
        this.requestAPI = '';
        this.voteAPI = '';
        this.width = 0;
        this.height = 0;
        this.question = 'What is your favorite JS View library?';
        this.options = [{ id: 1, text: 'Lit' }, { id: 2, text: 'React' }, { id: 3, text: 'Angular' }];
        this.updateFrequency = 60;
        this.orientation = 'horizontal';
    }

    connectedCallback() {
        super.connectedCallback();
        this.updatePollResults();
        this.setupPollUpdater();
    }

    disconnectedCallback() {
        this.teardownPollUpdater();
    }

    updated(changedProperties) {
        if (changedProperties.has('options') && this._showResults) {
            const largetVote = Math.max(...this.options.map(option => option.votes));
            const percentages = this.options.map(option => (option.votes / largetVote) * 90);

            this.options.forEach((option, idx) => {
                this._option(option.id).animate([
                    { width: '90%' },
                    { width: `${percentages[idx]}%` }
                ], {duration: 400, easing: 'ease-out', fill: 'forwards'})
            });
        }
    }

    _option(id) {
        return this.renderRoot?.querySelector(`[data-option-id="${id}"] .option-text`) ?? null;
    }

    render() {
        const width = this.width ? `${this.width}px` : 'auto';
        const height = this.height ? `${this.height}px` : 'auto';
        const dimensions = { width, height };

        return html`
            <section class=${this._showResults ? 'results' : 'hide-results'} style=${styleMap(dimensions)} id="poll-container">
                <h2 id="question">${this.question}</h2>
                <ol id="option-container">
                    ${this.options.map(
                        option => html`
                            <li data-option-id=${option.id} @click=${this.handleOptionClick} id="option">
                                <ul id="option-content">
                                    <li class="option-text">${option.text}</li>
                                    <li class="option-votes">${option.votes}</li>
                                </ul>
                            </li>`
                    )}
                </ol>
            </section>
        `;
    }

    async handleOptionClick (event) {
        if (this._showResults) {
            return;
        }

        const option = event.target.closest('#option');
        this._showResults = true;
        await this.castVote(option.dataset.optionId);
    }

    async updatePollResults() {
        const response = await fetch(this.requestAPI);
        const result = await response.json();
        
        this.updateView(result);
    }

    async castVote(id) {
        const response = await fetch(this.voteAPI, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id})
        });

        const result = await response.json();
        this.updateView(result);
    }

    updateView(result) {
        this.question = result.question;
        this.options = result.options;
    }

    setupPollUpdater() {
        if (!this._intervalTimer) {
            this._intervalTimer = setInterval(
                this.updatePollResults, this.updateFrequency * 60 * 1000
            );
        }
    }

    teardownPollUpdater() {
        clearInterval(this._intervalTimer);
        delete this._intervalTimer;
    }
}

customElements.define('poll-widget', PollWidget);
