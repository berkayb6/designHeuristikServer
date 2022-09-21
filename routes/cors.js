const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'https://localhost:3001', 'https://130.149.46.142/:3443','https://130.149.46.142/:3001', 'http://130.149.46.142/:3001', 'http://BB-PC:3001', 'https://better-desing.org:3443', 'https://better-desing.org:3001', 'http://better-desing.org:3001', 'http://better-desing.org:3000'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);