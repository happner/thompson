var url = require('url')
  , github = require('octonode')
  , async= require('async')
  ;


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

  if (newRepo.events.indexOf("test") == -1) newRepo.events.push("test");

  if (addRepo.owner && addRepo.name){

    newRepo.owner = addRepo.owner;
    newRepo.name = addRepo.name;

  }else{

    if (!addRepo.name) throw new Error('a name must be specified for the repo');

    var ownerRepo = addRepo.name.split('/');

    if (ownerRepo.length == 2) {

      newRepo.owner = ownerRepo[0];
      newRepo.name = ownerRepo[1];
    } else throw new Error('repo needs to be configured either with an \'owner\' and \'name\' property or a \'name\' property in the format \'<owner>/<name>\'');
  }

  this.repos[newRepo.owner + '/' + newRepo.name] = newRepo;
};

Webhooks.prototype.ensureRepo = function(repoClient, repo){

  var _this = this;

  return new Promise(function(resolve, reject){

    var ghRepo = repoClient.repo(repo.owner + '/' + repo.name);

    ghRepo.hooks(function(e, hooks){

      /*

       [
       {
       "type": "Repository",
       "id": 11084096,
       "name": "web",
       "active": true,
       "events": [
       "pull_request",
       "push"
       ],
       "config": {
       "url": "http://heathendigital.com/hooks?secret=YYTAAG4562fDSsa"
       },
       "updated_at": "2016-12-09T12:31:17Z",
       "created_at": "2016-12-09T12:31:17Z",
       "url": "https://api.github.com/repos/happner/tracey/hooks/11084096",
       "test_url": "https://api.github.com/repos/happner/tracey/hooks/11084096/test",
       "ping_url": "https://api.github.com/repos/happner/tracey/hooks/11084096/pings",
       "last_response": {
       "code": 422,
       "status": "misconfigured",
       "message": "Invalid HTTP Response: 307"
       }
       }
       ]
       */

      if (e) return reject(new Error('hooks fetch failed for repo ' + repo.name, e));

      _this.services.log.success('have hooks', hooks);

      var found = false;

      hooks.every(function(hook){

        _this.services.log.info('matching hook', hook);

        if (hook.config.url == _this.config.url &&
          hook.events.indexOf('push') > -1 &&
          hook.events.indexOf('pull_request') > -1)
          found = true;

        return found;
      });

      if (!found)  _this.__createHook(ghRepo, repo, repoCB);
      else repoCB();

  });

};

Webhooks.prototype.ensureRepos = function(){

  var _this = this;

  return new Promise(function(resolve, reject){

    try{

      var github = github.client(this.options.token);

      async.eachSeries(Object.keys(_this.repos), function(repoName, repoCB){

        _this.ensureRepo(github, _this.repos[repoName]).then(repoCB).catch(repoCB);

      }, function(e){

        if (e) return reject(e);
        resolve(_this);
      })

    }catch(e){
      reject(e);
    }
  });
};

module.exports = Webhooks;