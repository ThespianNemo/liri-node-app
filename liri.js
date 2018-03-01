//code to read and set any environment variables with the dotenv package
require("dotenv").config();

var fs = require("fs");
var request = require("request");
var nodeArgs = process.argv;

var doThisPhrase;

var movieName = " ";

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

var userRequest = process.argv[2];
var songTitle = " ";
var random =  " ";

//------------------------------------------------------------------------------------------------------------------
function movieThis() {

  if (doThisPhrase != " ") {
      movieName = doThisPhrase;
  } else {
      for (var i = 3; i < nodeArgs.length; i++) {
      movieName = movieName + "+" + nodeArgs[i];
    }
  }

  if(movieName === " ") {
    movieName = "Mr. Nobody";
  } 
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("Movie title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    } 
  });

}
//------------------------------------------------------------------------------------------------------------------

function myTweets() {
  
var params = {screen_name: 'STLbornandbred', count: 20};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i = 0; i < 20; i++) {
      console.log("Tweet #" + i + " " + tweets[i].text);
      console.log("Date tweeted " + i + " " + tweets[i].created_at);
    } 
  } else {
    console.log("error");spotify-this-song
    }
});
}
//------------------------------------------------------------------------------------------------------------------

function spotifyThisSong() {
  
  console.log(doThisPhrase);

  if (doThisPhrase != " ") {
    songTitle = doThisPhrase;
  } else {
      for (var i = 3;i < nodeArgs.length; i++) {
      songTitle = songTitle + "+" + nodeArgs[i];
    }
  }
  if (songTitle === " ") {
    songTitle = "The Sign ace of base";
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
//------------------------------------------------------------------------------------------------------------------

function doWhatItSays() {
  
  fs.readFile("random.txt", "utf8", function(err, data) {

    if (err) {
        return console.log(err);
    }
    var itSays = data.split(",");
    var doThis = itSays[0];
    doThisPhrase = itSays[1];

    if (doThis === "spotify-this-song") {
      spotifyThisSong();
    }

    if (doThis === "movie-this") {
      movieThis();
    }

    if (doThis === "my-tweets") {
      myTweets();
    }
  })
}
  
//------------------------------------------------------------------------------------------------------------------

if (userRequest === "spotify-this-song") {
  spotifyThisSong();
}

if (userRequest === "movie-this") {
  movieThis();
} 

if (userRequest === "my-tweets") {
  myTweets();
} 

if (userRequest === "do-what-it-says") {
  doWhatItSays();
}
