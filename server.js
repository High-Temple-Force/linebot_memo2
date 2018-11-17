'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'QUhb/CZfcIOjJfW+eot0JOEko0AU4L2SbbPEAoWky/MrAJ3rlv8HXBWkHk6S5HhISfGfM6sMr7fqQg5zcfP5clonGNpzeGQHKZvpHXVchX+S8/FMS0nwwJg1uS3nN3o8DnVxzv1WGQGZN1wlqAl+cAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '21fea600e9c1412f9325d76544f44cd7',
};
// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
// for MONGODB
const mongoose = require('mongoose'); 
const dburi = 'mongodb://heroku_jzvwfqb3:aiqsab7lo63grgr9tot4c16234@ds163683.mlab.com:63683/heroku_jzvwfqb3'; //db uri
const col_name = 'linebot_message';　//collection name
// define schema MONGO
const schema = mongoose.Scheme({
  user_id: String,
  text: String
});
// Create model memo documents in "linebot_message" NAME
mongoose.model(col_name, schema);
// Create message JSON 
const Message = mongoose.model(col_name);
const input_message = new Message();
input_message.update( { user_id: id }, { $set: { user_id: id , text: messatetext}}, { upsert:true });

// testing connect to MONGO DB
mongoos.connect(dburi, function (err, res) {
  if (err) {
    console.log('Error: ' + err);
  } else {
    console.log('Successfully connected.');
  }
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
    });
  req.body.events.map(getid);
  console.log(id);
  const input_message = new Message();
  input_message.update( { user_id: id }, { $set: { user_id: id , text: messatetext}}, { upsert:true });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

//ADD userID to mongo DB
function getid(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    ; //do nothing
  } else {
    const userid = event.source.userId;
   }  
}

// connect MONGO DB
mongoos.connect(dburi, function (err, res) {
  if (err) {
    console.log('Error: ' + err);
  } else {
    console.log('Successfully connected.');
  }
});
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
