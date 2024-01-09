const SERVER_PORT = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes');

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(SERVER_PORT);