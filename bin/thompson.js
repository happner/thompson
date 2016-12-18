var commander = require('commander')
  , chalk = require('chalk')
;

commander

  .version (JSON.parse(require('fs').readFileSync(__dirname + '/../package.json')).version)

  .option ("-r, --repo <val>", "the repo")

  .option ("-t, --token <val>", "the token for github")

  .option ("-s, --secret <val>", "the secret for github webhook")

  .option ("-u, --url <val>", "the url we are listening on")

  .option ("-e, --events <val>", "the events we are listening for comma seperated ie: push,pull")

  .parse(process.argv);


  var repo = commander.option('r').repo;

  var token = commander.option('t').token;

  var secret = commander.option('s').secret;

  var url = commander.option('u').url;

  var events = ['push'];

  if (commander.option('e').events){
    events = commander.option('e').events.split(',');
  }

  var Thompson = require('../index');

  var options = {
    "url": url,
    "token": token,
    "secret": secret
  };

  var thompson = new Thompson(options);

  thompson.on('webhook-event', function (message) {
    console.log('have event back:::', message);
    done();
  });

  thompson
  //add one
  .addRepo({
    name: repo
  })
  //then listen for webhook callbacks
  .then(

    thompson.listen()

    .then(function(){
      console.log('watching' + repo + ' for ' + events.join(',') + ' event(s) on url ' + url);
    })
    .catch(function(e){
      console.log('FAILURE LISTENING TO REPO:::' + repo);
    })
  ).catch(function(e){
    console.log('FAILURE LISTENING TO REPO:::' + repo);
  });




