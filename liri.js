//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import the keys.js file
var keys = require("Twitter", "Spotify");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
