describe('unit tests', function () {

  var expect = require('expect.js');

  var config;

  try{
    config = require('../private/config.json');
  }catch(){
    throw new Error('a private configuration file ./private/config.json with a github token and secret for your webhooks must be created to perform the tests, template at ./private/config.template.json');
  }

  this.timeout(120000);

  it('util', function (done) {

    var Util = require('../lib/util');
    var util = new Util();

    done();
  });


  it('webhook', function (done) {

    var Webhook = require('../lib/webhook');

    var webhook = new Webhook({
      url:'http://localhost:55555'
    });

    webhook.listen(function(e){

      if (e) return done(e);

      expect(webhook.host).to.be('0.0.0.0');
      expect(webhook.port).to.be('55555');

      done();
    });
  });


  it('is able to initialize', function (done) {

    var Thompson = require('../index.js');

    var thompson = new Thompson({
      test:'options'
    });

    expect(thompson.__util).to.not.be(null);
    expect(thompson.__webhook).to.not.be(null);
    expect(thompson.__options.test).to.be('options');

    done();
  });

});