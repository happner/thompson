var githubhook = require('githubhook')
  , url = require('url')
  ;

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

Listener.prototype.__handleGithubEvent = function(){

  var _this = this;

  console.log('args:::', JSON.stringify(arguments, null, 2));

  //emit github events to webhooks handlers

  Object.keys(webhooks.repos).forEach(function(repoName){

    var repo = webhooks.repos[repoName];
    //check if repo events and name matches up, fire of the handler if it does
  });

};

Listener.prototype.listen = function(webHookEventHandler){

  var _this = this;

  Object.defineProperty(this, '__webHookEventHandler', {value:webHookEventHandler});

  var url = url.parse(_this.__url);

  var github = githubhook({
    host:_this.__host,
    port:url.port,
    path:url.pathname,
    secret:_this.__secret
  });

  github.on('*', this.__handleGithubEvent.bind(this));

  return github.listen();
};

module.exports = Listener;