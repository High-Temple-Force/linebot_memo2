'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
// PORT number may be needed to change
const PORT = process.env.PORT || 3010 ;
// create LINE SDK config from env variables
const CHANNEL_ACCESS_TOKEN = 'QUhb/CZfcIOjJfW+eot0JOEko0AU4L2SbbPEAoWky/MrAJ3rlv8HXBWkHk6S5HhISfGfM6sMr7fqQg5zcfP5clonGNpzeGQHKZvpHXVchX+S8/FMS0nwwJg1uS3nN3o8DnVxzv1WGQGZN1wlqAl+cAdB04t89/1O/w1cDnyilFU=';
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN
};

const app = express();
const client = new line.Client(config);
const message = {
    type: 'text',
    text: 'Hello World!'
  };
const url = 'https://api.line.me/v2/bot/message/push';
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
  };

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