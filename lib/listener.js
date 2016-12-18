var githubhook = require('githubhook')
  , url = require('url')
  , Util = require('./util')
  ;

var util = new Util();

function Listener(webhooks, options){

  if (!options.url) throw new Error('url must be specified');
  if (!options.secret) throw new Error('webhook secret must be specified');
  if (!options.token) throw new Error('github api token must be specified');
  if (!options.host) options.host = '0.0.0.0';

  Object.defineProperty(this, '__options', {value:options});

  Object.defineProperty(this, '__url', {value:options.url});

  Object.defineProperty(this, '__host', {value:options.host});

  Object.defineProperty(this, '__secret', {value:options.secret});

  Object.defineProperty(this, '__token', {value:options.token});

  Object.defineProperty(this, '__webhooks', {value:webhooks});

}

Listener.prototype.__handleGithubEvent = function(event, repoName, branch, detail){

  var _this = this;

  util.log.info('received github event');

  var repos = [];

  //emit github events to webhooks handlers

  Object.keys(_this.__webhooks.repos).forEach(function(repoName){

    var repo = _this.__webhooks.repos[repoName];
    //check if repo events and name matches up, fire of the handler if it does
    if (repo.name == repoName) repos.push(repo);
  });

  var message = {
    event:event,
    repoName:repoName,
    branch: branch,
    detail:detail,
    repos:repos
  };

  util.log.info('firing handler');

  _this.__webHookEventHandler(message);

};

Listener.prototype.listen = function(webHookEventHandler, callback){

  var _this = this;

  Object.defineProperty(this, '__webHookEventHandler', {value:webHookEventHandler.bind(webHookEventHandler)});

  var parsedUrl = url.parse(_this.__url);

  var listenOptions = {
    host:_this.__host,
    port:parseInt(parsedUrl.port),
    path:parsedUrl.pathname,
    secret:_this.__secret
  };

  util.log.info('listening on: ', listenOptions);

  var github = githubhook(listenOptions);

  github.on('*', this.__handleGithubEvent.bind(this));

  github.listen(callback);
};

Listener.prototype.test = function(){

  this.__handleGithubEvent({repo:'test/repo', test:'val'});
};

module.exports = Listener;