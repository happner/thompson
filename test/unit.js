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


  it('webhook instantiate', function (done) {

    var Webhook = require('../lib/webhook');

    var url = require('url');

    var webhook = new Webhook({
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    expect(webhook.options.url).to.be(config.webhooks.URL);

    var parsedURL = url.parse(webhook.options.url);

    expect(webhook.options.port).to.be(parsedURL.port);
    expect(webhook.options.token).to.be(config.webhooks.TOKEN);
    expect(webhook.options.secret).to.be(config.webhooks.SECRET);

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

  it('webhook instantiate port 80', function (done) {

    var Webhook = require('../lib/webhook');

    var webhook = new Webhook({
      url:'www.blah.com',
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    expect(webhook.options.url).to.be('www.blah.com');
    expect(webhook.options.port).to.be(80);

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
      name:'happner/thompson',
      events: ["push"],
      handler:function(message, callback){

      }
    });

    webhook.addRepo([{
      name:'happner/test1',
      handler:function(message, callback){

      }
    },{
      name:'happner/test2',
      handler:function(message, callback){

      }
    }]);

    expect(Object.keys(webhook.repos).length).to.be(3);

    expect(webhook.repos['happner/thompson']).to.eql({
      owner:'happner',
      name:'thompson',
      events: ["push"],
      active:true
    });

    expect(webhook.repos['happner/test1']).to.eql({
      owner:'happner',
      name:'test1',
      events: ["push", "pull_request"],
      active:true
    });

    expect(webhook.repos['happner/test2']).to.eql({
      owner:'happner',
      name:'test2',
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


  it('listener initialize', function (done) {

    var Webhook = require('../lib/webhook');

    var webhook = new Webhook({
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    webhook.addRepo({
      name:'thompson/test',
      events: ["push", "test"],
      handler:function(message, callback){

      }
    });

    var Listener = require('../lib/listener');

    var listener = new Listener(webhook, {
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    var parsedURL = url.parse(config.webhooks.URL);

    expect(listener.__url).to.be(config.webhooks.URL);
    expect(listener.__token).to.be(config.webhooks.TOKEN);
    expect(listener.__secret).to.be(config.webhooks.SECRET);

    expect(listener.__webhooks).to.eql(webhook);

    done();
  });

  it('promise structure works nicely', function (done) {

    var Thompson = require('../index.js');

    var thompson = new Thompson({
      test:'options',
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    thompson.addRepo = Promise.promisify(function(repo, callback){
      callback();
    });

    thompson.listen = Promise.promisify(function(callback){
      callback();
    });

    thompson.on('webhook-event', function(message){
      expect(message.repo.name).to.be('happner/thompson');
      expect(message.event).to.be('push');
      done();
    });

    thompson
      //add a single repo to watch
      .addRepo({
        name:'happner/thompson',
        url:'www.blah.com'
      })

      .then(function(){
        //add a multiple repos to watch
        return thompson.addRepo([{
          name:'herge/haddock',
          url:'www.blah.com'
        },{
          name:'herge/tintin',
          url:'www.blah.com'
        }])
      })

      //then listen for webhook callbacks
      .then(thompson.listen())
      .then(function(){
        thompson.__onWebHookEvent({repo:{name:'happner/thompson'}, event:'push'});
      })
      .catch(done);

  });

  it('is able to initialize', function (done) {

    var Thompson = require('../index.js');

    var thompson = new Thompson({
      test:'options',
      url:config.webhooks.URL,
      token:config.webhooks.TOKEN,
      secret:config.webhooks.SECRET
    });

    expect(thompson.__util).to.not.be(null);
    expect(thompson.__webhook).to.not.be(null);
    expect(thompson.__options.test).to.be('options');

    done();
  });

});