'use strict';

const line = require('@line/bot-sdk');
const { Client } = require('pg');
// create LINE SDK config from env variables
const CHANNEL_ACCESS_TOKEN = 'QUhb/CZfcIOjJfW+eot0JOEko0AU4L2SbbPEAoWky/MrAJ3rlv8HXBWkHk6S5HhISfGfM6sMr7fqQg5zcfP5clonGNpzeGQHKZvpHXVchX+S8/FMS0nwwJg1uS3nN3o8DnVxzv1WGQGZN1wlqAl+cAdB04t89/1O/w1cDnyilFU=';
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: '21fea600e9c1412f9325d76544f44cd7'
};
// create LINE SDK client
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

// Pushmessage func
function sendpush(message_push, userid_push) {
    client.pushMessage(message_push, {
        type: 'text',
        text: userid_push })
        .then(() => {
            console.log('Sent push messages');
        })
        .catch((err) => {
            console.error(err);
            return;
        });
}