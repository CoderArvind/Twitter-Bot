var Twit= require('twit');
var config=require('./config');
var request = require('request');
//$ = require('jQuery');
var http=require('http');

var T = new Twit(config);

var stream=T.stream('user');
stream.on('follow',followedUser);
stream.on('tweet',readTweet);

function followedUser(eventObj)
{
  var name=eventObj.source.screen_name;
  tweetIt(".@"+name+" Thank you for following me.");
}

function readTweet(eventObj)
{
  var sender=eventObj.user.screen_name;
  var hashtags=eventObj.entities.hashtags;
  if(hashtags.length==2 && hashtags[0].text.toLowerCase()=='weather')
  {
    weather(hashtags[1],sender);
  }
  else if (hashtags.length==2 && hashtags[0].text.toLowerCase()=='word') {
    words(hashtags[1],sender);
  //  console.log(hashtags[1]+sender);
  }
  else{
    //tweetIt(".@"+sender+" Sorry, something went wrong! :-(");
  }
}

function words(data,sender){
  var sender=sender;
  var findWord=data.text.toLowerCase();
  var api_key="&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
  var unit="/definitions?limit=20&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false";
  options ={
      url: 'http://api.wordnik.com/v4/word.json/'+findWord+unit+api_key,
      json: true
  };
  request.get(options,getDefinition);
//  $.getJSON(apiUrl,getWeather,'jsonp');
function getDefinition(err,response,wordData)
{
  if( !err && response.statusCode===200){
      for (var i = 0; i < wordData.length; i++)
      {
      var textLength=wordData[i].text.length;
        if(textLength<=105)
        {
        tweetIt("@"+sender+" "+wordData[i].word+":"+wordData[i].text );
        break;
        }
      }
  }
  else{
      tweetIt(".@"+sender+" Sorry, something went wrong! :-(");
  }
}
}

function weather(data,sender)
{
    var sender=sender;
    var city=data.text.toLowerCase();
    var api_key="&APPID=ee46ebbe1e1716d6214d5abff1545c42";
    var unit="&units=metric";
    options ={
        url: 'http://api.openweathermap.org/data/2.5/weather?q='+city+api_key+unit,
        json: true
    };
    request.get(options,getWeather);

  //  $.getJSON(apiUrl,getWeather,'jsonp');

  function getWeather(err,response,weatherData)
  {
    if( !err && response.statusCode === 200 ){
          var desc=weatherData.weather[0].description;
          var temp=weatherData.main.temp+" deg"+" celsius";
          var cityName=weatherData.name;
          tweetIt("@"+sender+" Its "+temp+" in "+city+" with "+desc);
    }
    else{
        tweetIt(".@"+sender+" Sorry, something went wrong! :-(");
    }
  }
 }

function tweetIt(txt)
{
  var tweet={status: txt};

  T.post('statuses/update', tweet, tweeting);

  function tweeting(err, data, response)
  {
    if(err)
    {
      console.log(data);
    }
  }
}




console.log("fine uptil now");
