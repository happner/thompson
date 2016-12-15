var url = require('url');


function Webhooks(options){

  if (!options.url) throw new Error('url must be specified');
  if (!options.secret) throw new Error('webhook secret must be specified');
  if (!options.token) throw new Error('github api token must be specified');

  Object.defineProperty(this, '__options', {value:options.url});

  var urlParts = url.parse(options.url);

  Object.defineProperty(this, 'port', {value:urlParts.port});
  Object.defineProperty(this, 'port', {value:urlParts.port});

}

Webhooks.prototype.listen = function(){

};

module.exports = Webhooks;