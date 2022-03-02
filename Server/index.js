const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();

const db = monk('localhost/dogger');
const woofs = db.get('woofs');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Woof! 🐶'
    })
});

app.get('/woofs', (req, res) => {
    woofs
        .find()
        .then(woofs => {
            res.json(woofs);
        });

});


function isValidWoof(woof) {
    return woof.name && woof.name.toString().trim() !== '' &&
    woof.content && woof.content.toString().trim() !== '';
}

app.post('/woofs', (req, res) => {
    if (isValidWoof(req.body)){
        // insert into db
        const woof = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        woofs
            .insert(woof)
            .then(createdWoof => {
                res.json(createdWoof);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Name and Content are Required!'
        });
    }
});


app.listen(5500, () => {
    console.log('Listening on http://localhost:5500');
});