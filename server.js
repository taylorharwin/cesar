var T = require('twit');
var _ = require('underscore');
var mongodb = require('mongodb');
var uri = process.env.MONGOLAB_URI;
var http = require('http'); 
var url = require('url'); 


http.createServer(function (req, res) { 
 console.log("Request: " + req.method + " to " + req.url); 
 res.writeHead(200, "OK"); 
 res.write("<h1>Server</h1>Server is running"); 
 res.end(); 
}).listen(process.env.PORT); 
console.log("server ready");



var myClient = new T({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function transformTweet(tweet){
  tweet = tweet.replace(/dog/g, 'penis');
  tweet = tweet.replace(/dogs/g, 'penises');
  return tweet;
}
function postTweet(newTweet, oldTweet){
  if (newTweet !== oldTweet){
    myClient.post('statuses/update', { status: newTweet }, function(err, data, response) {
      console.log(data);
    });
  }
}

var db = mongodb.MongoClient.connect(uri, function(err, db) {
  if(err){
    throw err;
  }
  else {
    console.log('connected to mongo');
    var tweets = db.collection('tweets');
  }

function getTweets(){
  myClient.get('statuses/user_timeline', { screen_name: 'cesarmillan', count: 1}, function (err, data, response) {
    console.log('fetched new tweet');
    _.each(data, function(tweet){
      if (tweet.text.indexOf('dog') > -1){
        var newTweet = {
          text: transformTweet(tweet.text),
          created_at: tweet.created_at
        };
        if (newTweet.text !== currentTweet && !newTweet.text.indexOf('@')){
          postTweet(newTweet.text, currentTweet);
          currentTweet = newTweet.text;
          tweets.insert(newTweet, function(err, result){
            if (err){
              throw err;
            } else{
              console.log('new tweet added to db');
            }
          });
        }
      }
    });
  });
}

console.log('starting server');

var currentTweet = '';

setInterval(getTweets, 6000);

});


