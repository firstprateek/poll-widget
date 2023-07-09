# poll-widget

A web component for a poll widget that is highly customizable and can be easily embedded into a web page.
Developed using [LIT](https://lit.dev/).

## Live Demo

[Demo](https://firstprateek.github.io/poll-widget/)

## Installation

```bash
npm install poll-widget --save
```

## Usage

```js
// In index.js
import PollWidget from 'poll-widget';
```

```jsx
<!DOCTYPE html>
<head>
    <script src="./index.js"></script>
</head>
<body>
    <main>
        
        <poll-widget 
            voteAPI="http://localhost:3000/posts" 
            requestAPI="http://localhost:3000/posts" 
            height="200" 
            width="600">
        </poll-widget>
    </main>
</body>
</html>
```

```js
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
 * @property updateFrequency - Number. Minutes after which the poll results should be auto-updated, default 60 mins
 * @property timeAgo - Boolean. Show time ago the poll results were updated
 * 
 * @fires submit - Indicates when the user submits a vote
 * 
 * @cssproperty --poll-background-color - background color of the poll, default is purple
 * @cssproperty --poll-color - text color, default white
 * @cssproperty --poll-font-size - font size of text, title is 1.5 em, default 16px 
 * @cssproperty --poll-border-radius - border radius of the poll widget, default 5px
 * @cssproperty --poll-bar-border-radius - border radius of the poll bars, default 2px
 * @cssproperty --poll-bar-color - color for the bars, default Cornflower Blue
 * @cssproperty --poll-vote-color - color for the votes
 */
```
