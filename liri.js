// const dotenv = require("dotenv").config();
// var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);
// const keys = require('./keys.js');
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var request = require('request');
var fs = require('fs');
var omdbKey = keys.omdb.api_key;

// Using const to set reference to value
const command = process.argv[2];
const secondCommand = process.argv[3];
// switching between cases for the 4 different commands
switch (command) {
    case ('concert-this'):
        if(secondCommand){
            concertThis(secondCommand);   
        }
    break;
    case ('spotify-this-song'):
        if(secondCommand){
            spotifyThis(secondCommand);
         } else{
            //  creating the default
            spotifyThis('"The Sign" Ace of Base');
         }
    break;
    case ('movie-this'):
        if(secondCommand){
            omdb(secondCommand);
        } else{
            // creating default
            omdb("Mr.Nobody");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    break;
    case ('do-what-it-says'):
         doIt();
    break;
    default:
        console.log('Try again');
};
// concertThis function
function concertThis(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      console.log("Name of the venue:", response.data[0].venue.name);
      console.log("Venue location:", response.data[0].venue.city);
      var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
      console.log("Date of the Event:", eventDate);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// spotify function to get song information
function spotifyThis(song){
    spotify.search({ type: 'track', query: song, limit: 1}, function(error, data){
        if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
            var songData = data.tracks.items[i];
            //artist
            console.log("Artist: " + songData.artists[0].name);
             //song name
            console.log("Song: " + songData.name);
             //spotify preview link
            console.log("Preview URL: " + songData.preview_url);
             //album
            console.log("Album: " + songData.album.name);
            console.log("-----------------------");
            } 
        } else {
        console.log('Error occurred.');
        }
    });
    }
// omdb movie function to get all of the information
// tried using a different method by opting for request body
    function omdb(movie){
        var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + omdbKey + '&plot=short&tomatoes=true';
    //   Used 200 response status as indicator that request was successful
        request(omdbURL, function (error, response, body){
            // if not an error then console.log the selected information
          if(!error && response.statusCode == 200){
            var body = JSON.parse(body);
      
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            // if there is an error then display this message
          } else{
            console.log('Error occurred.')
          }
        });
      
      }
    //   defining the doIt function that runs for the do what it says command
      function doIt(){
        fs.readFile('random.txt', "utf8", function(error, data){
          var txt = data.split(',');
      
          spotifyThis(txt[1]);
        });
      }