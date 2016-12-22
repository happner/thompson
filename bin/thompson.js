var commander = require('commander')
  , Util = require('../lib/util')
  ;
;

var util = new Util();

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

  if (commander.option('e').events) events = commander.option('e').events.split(',');

  var Thompson = require('../index');

  var options = {
    "url": url,
    "token": token,
    "secret": secret
  };

  var thompson = new Thompson(options);

  thompson.on('webhook-event', function (message) {

    util.log.success('have event back:::');
    util.log.success('repo:::' + message.name);
    util.log.success('owner:::' + message.owner);
    util.log.success('event:::' + message.event);
    util.log.success('branch:::' + message.branch);
  });

  thompson
  //add one
  .addRepo({
    name: repo,
    events:events
  });

  console.log('OK TIME TO LISTEN:::');
  thompson.listen()

    .then(function(){
      util.log.success('watching ' + repo + ' for ' + events.join(',') + ' event(s) on url ' + url);
    })
    .catch(function(e){
      util.log.error('FAILURE LISTENING TO REPO:::' + repo);
    })







