'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const { Client } = require('pg');
// PORT number may be needed to change
const PORT = process.env.PORT || 3010 ;
// create LINE SDK config from env variables
const CHANNEL_ACCESS_TOKEN = 'QUhb/CZfcIOjJfW+eot0JOEko0AU4L2SbbPEAoWky/MrAJ3rlv8HXBWkHk6S5HhISfGfM6sMr7fqQg5zcfP5clonGNpzeGQHKZvpHXVchX+S8/FMS0nwwJg1uS3nN3o8DnVxzv1WGQGZN1wlqAl+cAdB04t89/1O/w1cDnyilFU=';
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: '21fea600e9c1412f9325d76544f44cd7'
};
// create LINE SDK client
const app = express();
const client = new line.Client(config);
const client_db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
client_db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' );
        return;
    } 
    console.log('connected to POSTGRE, running.');
});
const query_select = 'SELECT * from linebot_message;';
const message = {
    type: 'text',
    text: 'Hello World!'
};

client_db.query(query_select, function(err, result) {
    if(err) {
        return console.error(err);
    } 
    const results = result.rows;
    results.map(row => {
        console.log(`SELECT DB as ${ JSON.stringify(row) }`);
        console.log(row.user_id);
    });
    
});


// Pushmessage func
function sendpush(mes) {
    client.pushMessage('送信ユーザID', message)
        .then(() => {
            console.log('Sent push messages');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
            return;
        });
}