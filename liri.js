//code to read and set any environment variables with the dotenv package
require("dotenv").config();

var request = require("request");
var nodeArgs = process.argv;

var movieName = "";

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'process.env.TWITTER_CONSUMER_KEY',
  consumer_secret: 'process.env.TWITTER_CONSUMER_SECRET',
  access_token_key: 'process.env.TWITTER_ACCESS_TOKEN_KEY',
  access_token_secret: 'process.env.TWITTER_ACCESS_TOKEN_SECRET'
});

var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

var userRequest = process.argv[2];
var songTitle = "";

//------------------------------------------------------------------------------------------------------------------
function movieThis() {
  for (var i = 3; i < nodeArgs.length; i++) {
      movieName = movieName + "+" + nodeArgs[i];
    }
  console.log(movieName);
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log(JSON.parse(body));
      console.log("Movie title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      //console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings.Source);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}
//------------------------------------------------------------------------------------------------------------------

function myTweets() {
  console.log("My tweets");
}/*
var params = {screen_name: 'STLbornandbred'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  } else {
    console.log("error");
  }
});*/
//------------------------------------------------------------------------------------------------------------------

function spotifyThisSong() {

  for (var i = 3;i < nodeArgs.length; i++) {
    songTitle = songTitle + "+" + nodeArgs[i];
  }

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  
  console.log("Artist: " + data.tracks.items[0].artists[0].name); 
  console.log("Song title: " + data.tracks.items[0].name);
  console.log("Song snippet: " + data.tracks.items[0].preview_url);
  console.log("From the album: " + data.tracks.items[0].album.name);
  });
}

if (userRequest === "spotify-this-song") {
  spotifyThisSong();
};

if (userRequest === "movie-this") {
  movieThis();
}

if (userRequest === "my-tweets") {
  myTweets();
}
