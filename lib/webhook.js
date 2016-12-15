var url = require('url')
  , Promise = require('bluebird')
  , github = require('octonode')
  ;


function Webhooks(options){

  if (!options.url) throw new Error('url must be specified');
  if (!options.secret) throw new Error('webhook secret must be specified');
  if (!options.token) throw new Error('github api token must be specified');
  if (!options.host) options.host = '0.0.0.0';

  Object.defineProperty(this, '__options', {value:options});

  Object.defineProperty(this, '__url', {value:options.url});

  var urlParts = url.parse(options.url);

  Object.defineProperty(this, '__port', {value:urlParts.port});
  Object.defineProperty(this, '__host', {value:options.host});
  Object.defineProperty(this, '__secret', {value:options.secret});
  Object.defineProperty(this, '__token', {value:options.token});

  Object.defineProperty(this, 'repos', {value:{}});

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

  if (addRepo.owner && addRepo.repo){

    newRepo.owner = addRepo.owner;
    newRepo.repo = addRepo.repo;

  }else{

    var ownerRepo = addRepo.repo.split('/');

    if (ownerRepo.length >= 2) {
      newRepo.owner = ownerRepo[0];
      newRepo.repo = ownerRepo[1];
    } else throw new Error('repo needs to be configured either with an owner and repo property or a repo property in the format \'owner/repo\'');
  }

  this.repos[newRepo.owner + '/' + newRepo.repo] = newRepo;
};

Webhooks.prototype.listen = function(callback){

};

module.exports = Webhooks;