var T = require('twit');
var _ = require('underscore');
var mongodb = require('mongodb');
var uri = MONGOLAB_URI;



var myClient = new T({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token:ACCESS_TOKEN,
  access_token_secret:ACCESS_TOKEN_SECRET
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
  myClient.get('statuses/user_timeline', { screen_name: 'cesarmillan', count: 5}, function (err, data, response) {

    _.each(data, function(tweet){
      if (tweet.text.indexOf('dog') > -1){
        var newTweet = {
          text: transformTweet(tweet.text),
          created_at: tweet.created_at
        };
        if (newTweet.text !== currentTweet){
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

setInterval(getTweets, 60000);

});


