'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const { Client } = require('pg');
// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
};
// query
const query_select = 'SELECT * from linebot_message;';
// create LINE SDK client
const client = new line.Client(config);
const client_db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
Promise
.all(connectcheck())
.then(updatequery(query_select))
.catch((err) => {
    console.error(err);
    res.status(500).end();
    return;
});

// connect to db func
function connectcheck() {
    client_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' );
            return;
        } 
        console.log('connected to POSTGRE, running.');
});
}

// update db func
function updatequery(query) {
    client_db.query(query_select, function(err, result) {
        if(err) {
            return console.error(err);
        } 
        const results = result.rows;
        results.map(row => {
            console.log(`SELECT DB as ${ JSON.stringify(row) }`);
            const userid_push = row.user_id;
            const message_push = row.text;
            sendpush(userid_push, message_push);
        });
    });
}


// pushmessage func
function sendpush(userid_push, message_push) {
    client.pushMessage(userid_push, {
        type: 'text',
        text: message_push })
        .then(() => {
            console.log('Sent push messages');
        })
        .catch((err) => {
            console.error(err);
            return;
        });
}