describe('unit tests', function () {

  var expect = require('expect.js');

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


  it('webhook instantiate', function (done) {

    var Webhook = require('../lib/webhook');

    var url = require('url');

    var webhook = new Webhook({
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    expect(webhook.__url).to.be(config.webhooks.URL);

    var parsedURL = url.parse(webhook.__url);

    expect(webhook.__port).to.be(parsedURL.port);
    expect(webhook.__token).to.be(config.webhooks.TOKEN);
    expect(webhook.__secret).to.be(config.webhooks.SECRET);
    expect(webhook.__url).to.be(config.webhooks.URL);

    done();

    // webhook.listen(function(e){
    //
    //   if (e) return done(e);
    //
    //   expect(webhook.host).to.be('0.0.0.0');
    //   expect(webhook.port).to.be('55555');
    //
    //   done();
    // });
  });

  it('webhook add', function (done) {

    var Webhook = require('../lib/webhook');

    var url = require('url');

    var webhook = new Webhook({
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    webhook.addRepo({
      repo:'happner/thompson',
      events: ["push"],
      handler:function(message, callback){

      }
    });

    webhook.addRepo([{
      repo:'happner/test1',
      handler:function(message, callback){

      }
    },{
      repo:'happner/test2',
      handler:function(message, callback){

      }
    }]);

    expect(Object.keys(webhook.repos).length).to.be(3);

    expect(webhook.repos['happner/thompson']).to.eql({
      owner:'happner',
      repo:'thompson',
      events: ["push"],
      active:true
    });

    expect(webhook.repos['happner/test1']).to.eql({
      owner:'happner',
      repo:'test1',
      events: ["push", "pull_request"],
      active:true
    });

    expect(webhook.repos['happner/test2']).to.eql({
      owner:'happner',
      repo:'test2',
      events: ["push", "pull_request"],
      active:true
    });

    done();

    // webhook.listen(function(e){
    //
    //   if (e) return done(e);
    //
    //   expect(webhook.host).to.be('0.0.0.0');
    //   expect(webhook.port).to.be('55555');
    //
    //   done();
    // });
  });


  it('is able to initialize', function (done) {

    var Thompson = require('../index.js');

    var thompson = new Thompson({
      test:'options',
      webhooks:{
        url:config.webhooks.URL,
        token:config.webhooks.TOKEN,
        secret:config.webhooks.SECRET
      }
    });

    expect(thompson.__util).to.not.be(null);
    expect(thompson.__webhook).to.not.be(null);
    expect(thompson.__options.test).to.be('options');

    done();
  });

});