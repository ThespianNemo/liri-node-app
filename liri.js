//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code to read and write from the random.txt file
var fs = require("fs");


var request = require("request");
var nodeArgs = process.argv;

var doThisPhrase;

var movieName = " ";

//twitter keys

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//spotify keys
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

var userRequest = process.argv[2];
var songTitle = " ";
var random =  " ";

//------------------------------------------------------------------------------------------------------------------
//Code to obtain movie info from OMDB
function movieThis() {

  //If the request came from the text file, send this parameter to the OMDB api
  if (doThisPhrase != " ") {
    console.log(doThisPhrase);
      movieName = doThisPhrase;
  //else use the user input
  } else {
      for (var i = 3; i < nodeArgs.length; i++) {
      movieName = movieName + "+" + nodeArgs[i];
    }
  }
//If there is no user input or info from the text file, defaut to Mr. Nobody
  if(movieName === " ") {
    movieName = "Mr. Nobody";
  } 
// Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      //Parse the returning info
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
//Code to obtain 20 tweets from Twitter
function myTweets() {
  
  var params = {screen_name: 'STLbornandbred', count: 20};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
      console.log("Tweet #" + i + " " + tweets[i].text);
      console.log("Date tweeted " + i + " " + tweets[i].created_at);
      } 
    } 
  })
}
//------------------------------------------------------------------------------------------------------------------

function spotifyThisSong() {
//If request came from the text file
  if (doThisPhrase != " ") {
    songTitle = doThisPhrase;

//else process user input
  } else {
      for (var i = 3;i < nodeArgs.length; i++) {
      songTitle = songTitle + "+" + nodeArgs[i];
      }
  }

//If no song title, default to  The Sign
  if (songTitle === " ") {
    songTitle = "The Sign ace of base";
  }
  console.log(songTitle);
  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
//Print the song info  
  console.log("Artist: " + data.tracks.items[0].artists[0].name); 
  console.log("Song title: " + data.tracks.items[0].name);
  console.log("Song snippet: " + data.tracks.items[0].preview_url);
  console.log("From the album: " + data.tracks.items[0].album.name);
  
  });
}
//------------------------------------------------------------------------------------------------------------------

function doWhatItSays() {
//read the file
  fs.readFile("random.txt", "utf8", function(err, data) {

    if (err) {
        return console.log(err);
    }

  //split the request from the movie title or song title
    var itSays = data.split(",");
    var doThis = itSays[0];
    doThisPhrase = itSays[1];

    //If a song requested, go to the spotify function
    if (doThis === "spotify-this-song") {
      spotifyThisSong();
    }

//If a movie requested, go to the OMDB function
    if (doThis === "movie-this") {
      movieThis();
    }

//If tweets requested, go to the twitter function
    if (doThis === "my-tweets") {
      myTweets();
    }
  })
}
  
//------------------------------------------------------------------------------------------------------------------
//If user requests a song, go to the spotify function
if (userRequest === "spotify-this-song") {
  spotifyThisSong();
}
//If user requests a movie, go to the OMDB function
if (userRequest === "movie-this") {
  movieThis();
} 
//If user requests their tweets, go to the twitter function
if (userRequest === "my-tweets") {
  myTweets();
} 
//If user wants their requet from a text file, go to the read file function
if (userRequest === "do-what-it-says") {
  doWhatItSays();
}
