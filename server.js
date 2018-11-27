'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const { Client } = require('pg');
// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
};
// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
const client_db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

// Connecting to Postgre DB
client_db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' );
        return;
    } 
    console.log('connected to POSTGRE, running.');
});

// register a webhook handler with middleware
// Use eventhandler for each request
app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
            return;
        });
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});


// eventhandler func
function handleEvent(event) {
    let replytext = '';
    if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
        replytext = 'エラーが発生しました。';
        return Promise.resolve(null);
    } else if (event.message.text === 'やった') {
        // stop push notification 
        deletedb(event);
        replytext = '通知を終了しました。';
    } else if (event.message.text === 'つかいかた') {
        // show how to use
        replytext = '"やった"と入力すれば、通知を止めます。新しいメモを送信すれば、その内容を1時間ごとに通知します。';
    } else {
        // update data on db when new messages come
        updatedata(event);
        replytext = '新しいメモを登録しました！毎時0分ごろ通知します。通知を終了するには、"やった"と入力してください。' ;
    }
    const echo = { type: 'text', text: replytext };
    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// delete data func
function deletedb(event) {
    const userid = event.source.userId;
    let query_bot = `DELETE from linebot_message WHERE user_id = '${ userid }'`;
    client_db.query(query_bot, function(err, result) {
        if(err) {
            return console.error(err);
        } 
        console.log(`Delete DB as ${ result }`);
    });
}

// update func
function updatedata(event) {
    const userid = event.source.userId;
    const message_text = event.message.text;
    console.log(userid);
    console.log(message_text);
    // Add data to DB query from here
    let query_bot = `INSERT into linebot_message VALUES 
    (1, '${userid}', '${message_text}') ON CONFLICT (user_id) 
    DO UPDATE set text = '${message_text}';`;
    //until here
    client_db.query(query_bot, function(err, result) {
        if(err) {
            return console.error(err);
        } 
        console.log(`Updated data as ${ result }`);
    });
}