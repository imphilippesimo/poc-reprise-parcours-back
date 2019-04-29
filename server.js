const express = require('express');
const app = express();
const port = 8080;
const hostname = '127.0.0.1';
const fs = require('fs');

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

// Access the parse results as request.body
app.post('/step', function (request, response) {
    console.log(request.body);
    const data = request.body;
    const date = new Date(data.savedDate);
    console.log(date);

    const fileName = "jsonfile.json";
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', (err) => {
        if (err)
            console.log(err);

    });

    response.sendStatus(200);
});

app.get('/step', function (request, response) {

    console.log(request.query);

    fs.readFile('jsonfile.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } else {
            let dataAsObj = {};
            try {
                const processInstanceId = JSON.parse(data).processInstanceId;
                if (
                    (!request.query.instance_id)
                    ||
                    ((request.query.instance_id) && (processInstanceId === request.query.instance_id))
                )
                    dataAsObj = JSON.parse(data); //now data are in an object
            } catch (error) {
                console.log(error);
            }
            response.send(dataAsObj);
        }
    });
});


const pad = (n) => {
    return n < 10 ? '0' + n : n;
}

const format = (date) => {
    const time = date.ge
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return pad(month + 1) + "_" + pad(day) + "_" + year;
}


