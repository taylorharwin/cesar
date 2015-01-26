var T = require('twit');
var _ = require('underscore');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user:'me',
  password:'stenborg'
});

connection.connect();

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
function getTweets(){
  myClient.get('statuses/user_timeline', { screen_name: 'cesarmillan', count: 2}, function (err, data, response) {
    _.each(data, function(tweet){
      if (tweet.text.indexOf('dog') > -1){
        var newTweet = transformTweet(tweet.text);
        postTweet(newTweet, currentTweet);
        currentTweet = newTweet;
        allTweets.push(newTweet);
      }
    });
  });
}

console.log('starting server');

var currentTweet = '';
var allTweets = [];

setInterval(getTweets, 10000);

