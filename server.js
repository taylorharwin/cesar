var T = require('twit');
var _ = require('underscore');
var mongodb = require('mongodb');
var uri = 'mongodb://heroku_app33504368:oa3i5pb84k3sgc94c4o2h5e82e@ds051640.mongolab.com:51640/heroku_app33504368';

var myClient = new T({
  consumer_key:'hAOjwjemkcUDmBBbBNJVTxAzP',
  consumer_secret: 'PhjIM9p0uVx6e8HcZVFNo9tiwm707Xuy1rUsyjHk2HT4bo740u',
  access_token:'2661077726-WRWT9engJnIYhaU7VUUo6adjiwQI4ENvPBYxuEa',
  access_token_secret:'2PXUqcqTTBzXu1RzMoJkWd2T9vuE9IIj64CP6ABB5aoe2'
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
            if (err){throw err} else{
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

setInterval(getTweets, 600000);

});


