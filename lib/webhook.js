var url = require('url')
  , github = require('octonode')
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

module.exports = Webhooks;