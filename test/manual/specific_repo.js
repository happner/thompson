describe('unit tests', function () {

  var expect = require('expect.js')
    , Promise = require('bluebird')
    , url = require('url')
    ;

  var config;

  try{
    config = require('../../private/config.json');
  }catch(e){
    throw new Error('a private configuration file ./private/config.json with a github token and secret for your webhooks must be created to perform the tests, template at ./private/config.template.json');
  }

  this.timeout(120000);

  it('thompson functional', function (done) {

    var Thompson = require('../../index');

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
        name:'happner/happner'
      });
      //add many
      //then listen for webhook callbacks
      thompson.listen()
      .then(done)
      .catch(done);
  });
});