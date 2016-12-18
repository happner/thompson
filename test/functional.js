describe('unit tests', function () {

  var expect = require('expect.js')
    , Promise = require('bluebird')
    , url = require('url')
    ;

  var config;

  try{
    config = require('../private/config.json');
  }catch(e){
    throw new Error('a private configuration file ./private/config.json with a github token and secret for your webhooks must be created to perform the tests, template at ./private/config.template.json');
  }

  this.timeout(120000);

  it('util', function (done) {

    var Util = require('../lib/util');
    var util = new Util();

    done();
  });


  it('webhook functional', function (done) {

    var Webhooks = require('../lib/webhook');

    var options = {
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    };

    var webhooks = new Webhooks(options);

    webhooks.addRepo({name:'happner/thompson'});

    webhooks.ensureRepos(done);
  });

  it('listener functional', function (done) {

    var Webhooks = require('../lib/webhook');

    var options = {
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    };

    var webhooks = new Webhooks(options);

    webhooks.addRepo({name:'happner/thompson'});

    webhooks.ensureRepos(function(e){

      var Listener = require('../lib/listener');

      var options = {
        url:config.webhooks.URL,
        token:config.webhooks.TOKEN,
        secret:config.webhooks.SECRET
      };

      var listener = new Listener(webhooks, options);

      listener.listen(function(message){
        console.log('received github event:::', message);
        done();
      }, function(e){
        if (e) return done(e);
      });

      listener.test();
    });
  });

  it('thompson functional', function (done) {

    var Thompson = require('../index');

    var options = {
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    };

    var thompson = new Thompson(options);

    thompson.on('webhook-event', function(message){
      console.log('have event back:::', message);
      done();
    });

    thompson
      //add one
      .addRepo({
        name:'happner/thompson'
      })
      //add many
      .then(thompson.addRepo([{
          name:'herge/haddock'
        },{
          name:'herge/tintin'
        }])
      )
      //then listen for webhook callbacks
      .then(thompson.listen())
      .then(thompson.test())
      .catch(done);
  });
});