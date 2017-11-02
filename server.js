"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser());

const bot = require('./bot');

app.get('/', function (req, res) {
  bot.register(req, res);
});

app.post('/', function (req, res) {
    bot.handleMessage(req, res);
});

app.listen(3000, function () {
  console.log('Bird bot listening on port 3000!');
});