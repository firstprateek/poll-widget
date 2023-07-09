const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let votes = [
    {
        id: 1,
        text: 'Lit',
        votes: 500
    },
    {
        id: 2,
        text: 'React',
        votes: 1000
    },
    {
        id: 3,
        text: 'Angular',
        votes: 750
    }
];

app.get('/posts', function (req, res) {
    res.json({
        question: 'What is your favorite JS View library?',
        options: votes
    })
});

app.patch('/posts', function (req, res) {
    let idx = votes.findIndex(v => v.id === Number(req.body.id));
    votes[idx].votes++;
    res.json({
        question: 'What is your favorite JS View library?',
        options: votes
    })
});

app.listen(4000, function () {
    console.log("Server is running on localhost4000");
});
