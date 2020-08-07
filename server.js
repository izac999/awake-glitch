const express = require('express');
const app = express();
const fs = require("fs");

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', function(request, response) {
  response.sendFile(__dirname + '/views/admin.html');
});

app.get('/addurl', function(request, response) {
   var url = request.query["url"];
  
  if (url !== undefined)
  {
   addUrl(url).then(() => {
     response.send('Your URL has been added! If you would like to go home please click <a href="https://wake-up.freddyxd.repl.co">here</a>');
   }).catch((reason) => {
     if (reason == "URL_IN_DB")
     {
       response.send('Your URL is already in our database! If you would like to go home please click <a href="https://wake-up.freddyxd.repl.co">here</a>');
     } else {
      response.send('Failed to add your URL! Please <a href="https://wake-up.freddyxd.repl.co/">try again</a>.'); 
     }
   });
  } else {
    response.send('Failed to add your URL! Please <a href="https://wake-up.freddyxd.repl.co">try again</a>.');
  }
});

function addUrl(url)
{
  return new Promise((res, rej) => {
    fs.readFile("./urls-save.json", "utf8", function(err, contents) {
      var j = JSON.parse(contents);
      if (j.indexOf(url) > -1) {
        rej("URL_IN_DB");
      } else {
         j.push(url); 
      }
      //db.add(`urls`, 1);
      fs.writeFile("./urls-save.json", JSON.stringify(j), 'utf8', () => {
        res();
      });
    });
  });
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
  
  // Start ping
  
  require("./ping.js");
});
