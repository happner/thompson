var url = require('url')
  , github = require('octonode')
  , async= require('async')
  , Util = require('./util')
  ;

var util = new Util();

function Webhooks(options){

  if (!options.url) throw new Error('url must be specified');
  if (!options.secret) throw new Error('webhook secret must be specified');
  if (!options.token) throw new Error('github api token must be specified');

  Object.defineProperty(this, 'repos', {value:{}});

  var parsedUrl = url.parse(options.url);

  options.port = parsedUrl.port ? parsedUrl.port : 80;

  Object.defineProperty(this, 'options', {value:options});

}

Webhooks.prototype.addRepo = function(addRepo){

  var _this = this;

  if (Array.isArray(addRepo)) return addRepo.forEach(function(repo){
    _this.addRepo(repo);
  });

  var newRepo = {
    active:true
  };

  if (addRepo.events) newRepo.events =  addRepo.events;

  else newRepo.events = ["push", "pull_request"];

  if (addRepo.owner && addRepo.name){

    newRepo.owner = addRepo.owner;
    newRepo.name = addRepo.name;

  }else{

    if (!addRepo.name) throw (new Error('a name must be specified for the repo'));

    var ownerRepo = addRepo.name.split('/');

    if (ownerRepo.length == 2) {

      newRepo.owner = ownerRepo[0];
      newRepo.name = ownerRepo[1];
    } else throw (new Error('repo needs to be configured either with an \'owner\' and \'name\' property or a \'name\' property in the format \'<owner>/<name>\''));
  }

  _this.repos[newRepo.owner + '/' + newRepo.name] = newRepo;
  
};

Webhooks.prototype.ensureHook = function(ghRepo, repo, callback){

  var _this = this;

  util.log.info('creating hook for ' + repo.owner + '/' + repo.name);

  ghRepo.hook({
    "name": "web",
    "active": true,
    "events": repo.events,
    "config": {
      "url": _this.options.url,
      "secret": _this.options.secret
    }
  }, function(e, response){

    if (e) {
      util.log.error('unable to create hook', e);
      return callback(e);
    }

    util.log.success('hook created ok');
    callback(null, response);
  }); // hook

};

Webhooks.prototype.ensureRepo = function(repoClient, repo, callback){

  var _this = this;

  var ghRepo = repoClient.repo(repo.owner + '/' + repo.name);

  ghRepo.hooks(function(e, hooks){

    if (e) {

      var errorMessage = 'hooks fetch failed for repo ' + repo.name + e.toString();
      util.log.error(errorMessage);

      return callback(new Error(errorMessage));
    }

    util.log.success('have hooks, count: ' + hooks.length);

    var found = false;

    hooks.every(function(hook){

      util.log.info('checking hook ' + hook.url);

      if (hook.config.url == _this.options.url) {

        found = true;

        var eventsMatch = true;

        repo.events.forEach(function(event){
          if (hook.events.indexOf(event) == -1) eventsMatch = false;//check for missing events
        });

        if (!eventsMatch) util.log.warn('matching hook found for url ' + hook.config.url + ' but the required events dont match');
        else util.log.success('matching hook found, with correct events');
      }

      return !found;
    });

    if (!found){

      _this.ensureHook(ghRepo, repo, function(e, response){

        if (e) return callback(e);

        callback();
      });
    } else {

      util.log.success('hook with external address ' + _this.options.url + ' and events ' + repo.events.join(', ') + ' already in place');
      callback();
    }
  });

};

Webhooks.prototype.ensureRepos = function(callback){

  var _this = this;

  try{

    var client = github.client(_this.options.token);

    async.eachSeries(Object.keys(_this.repos), function(repoName, repoCB){

      _this.ensureRepo(client, _this.repos[repoName], repoCB)

    }, function(e){

      if (e) return callback(e);
      callback();
    })

  }catch(e){
    callback(e);
  }
};

module.exports = Webhooks;