const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const hostname = '127.0.0.1';
const fs = require('fs');
const db = require('./queries');


app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());
app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

// Access the parse results as request.body
app.post('/step', function (request, response) {
    const data = request.body;
    const date = new Date(data.savedDate);
    //console.log(data);
    const steps = JSON.stringify(data.steps);
    //TODO decide to save or update or delete ...
    if (data.processInstanceId) {
        let processInstance = db.getProcessInstanceById(data.processInstanceId);
        if (processInstance) {

            db.updateProcessInstance(data.processInstanceId, flattenUrl(data.url,data.processInstanceId), data.savedDate, steps)
                .then(result => {
                    response.status(200).send(result);
                }).catch((error) => {
                    console.log(error);
                    response.status(500).send('An error occured during update');
                });

        }
        else
            response.status(400).send('Can not find process with id ' + data.processInstanceId + ' to update');
    } else {

        const processInstanceId = Math.floor(Math.random() * 200000).toString();
        db.createProcessInstance(data.processId, processInstanceId, flattenUrl(data.url, processInstanceId), data.savedDate, steps)
            .then(result => {
                response.status(201).send(result);
            })
            .catch((error) => {
                console.log(error);
                response.status(500).send('An error occured during creation');
            });
    }
});

app.get('/step', function (request, response) {


    const params = request.query;
    if (params.instance_id)
        db.getProcessInstanceById(params.instance_id).then(result => {
            //console.log(result);
            //result.steps = JSON.parse(result.steps);
            console.log(result.steps);
            response.status(200).send(result);
        })
            .catch(e => {
                console.log(e);
                response.status(500).send("An error occured during process retrieval");

            });
    else
        response.status(200).send({});

});

const flattenUrl = (url, processInstanceId) => {

    return url.host + ":" + url.port + "/" + url.stepId + "?instance_id=" + processInstanceId;

}

