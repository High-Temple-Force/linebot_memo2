'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const { Client } = require('pg');
// create LINE SDK config from env variables
const config = {
    channelAccessToken: 'QUhb/CZfcIOjJfW+eot0JOEko0AU4L2SbbPEAoWky/MrAJ3rlv8HXBWkHk6S5HhISfGfM6sMr7fqQg5zcfP5clonGNpzeGQHKZvpHXVchX+S8/FMS0nwwJg1uS3nN3o8DnVxzv1WGQGZN1wlqAl+cAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '21fea600e9c1412f9325d76544f44cd7'
};
// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
const col_name = 'linebot_message'; //collection name
const client_db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
            return;
        });
    const userid = req.body.events.map(getid);
    const message_text = req.body.events.map(getmessage);
    console.log(userid[0]);
    console.log(message_text[0]);
    client_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' );
            return;
        } 
        console.log('connected to POSTGRE');
    });
    const query_bot = `INSERT into linebot_message VALUES 
    (1, '${userid[0]}', '${message_text[0]}') ON CONFLICT (user_id) 
    DO UPDATE set text = '${message_text[0]}';`;
    client_db.query(query_bot, function(err, result) {
            if(err) {
                return console.error(err);
            } 
            console.log(`Updated DB as ${ result }`);
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
        return Promise.resolve(null);
    }
    // create a echoing text message
    let replytext = '';
    if(event.message.text === 'やった'){
        replytext = '通知を終了しました。'
    } else {
        replytext = '新しいメモを登録しました！また通知しますね。' 
    }
    const echo = { type: 'text', text: replytext };
    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

//ADD userID to mongo DB
function getid(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
    //do nothing
    } else {
        const userid = event.source.userId;
        return userid;
    }  
}
// Add text to mongo 
function getmessage(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
    //do nothing
    } else {
        const message_text = event.message.text;
        return message_text;
    }  
}
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
