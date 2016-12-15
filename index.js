var Util = require('./lib/util.js')
  , Webhook = require('./lib/webhook.js')
  ;

function Thompson(options){

  Object.defineProperty(this, '__options', {
    value:options
  });

  var __util = new Util();
  var __webhook = new Webhook();

  Object.defineProperty(this, '__util', {
    value:__util
  });

  Object.defineProperty(this, '__webhook', {
    value:__webhook
  });
}

Thompson.prototype.start = function(cb){

};

Thompson.prototype.stop = function(cb){

};

module.exports = Thompson;