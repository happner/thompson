var commander = require('commander')
  , chalk = require('chalk')

;

commander

  .version(JSON.parse(require('fs').readFileSync(__dirname + '/../package.json')).version)

  .command('watch <repo>', 'repo you want to watch in format owner/name')

  .option("-t, --token <val>", "the token for github")

  .option("-s, --secret <val>", "the secret for github webhook")

  .option("-u, --url <val>", "the url we are listening on")

  .action(function(cmd, option) {

    if (cmd == 'watch') {

      var repo = option;
      var token = commander.option('t').token;
      var secret = commander.option('s').secret;
      var url = commander.option('u').url;

      var Thompson = require('thompson');

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
        .addRepo({
          name: repo
        })
        .then(function(){

        })
        .catch(function(e){
          console.log('FAILURE LISTENING TO REPO:::' + repo);
        });

    }
  });

console.log('INTERACTIVE THOMPSON INSTANCE:::');



