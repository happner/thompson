var Util = require('./lib/util.js')
  , Webhook = require('./lib/webhook.js')
  , Listener = require('./lib/listener.js')
  , Promise = require('bluebird')
  , Events = require('events').EventEmitter
  ;

function Thompson(options){

  var _this = this;

  Object.defineProperty(_this, '__events', {
    value:new Events()
  });

  Object.defineProperty(_this, '__options', {
    value:options
  });

  var __util = new Util();
  var __webhook = new Webhook(options);
  var __listener = new Listener(__webhook, options);

  Object.defineProperty(_this, '__util', {
    value:__util
  });

  Object.defineProperty(_this, '__webhook', {
    value:__webhook
  });

  Object.defineProperty(_this, '__listener', {
    value:__listener
  });

  Object.defineProperty(_this, '__onWebHookEvent', {
    value:function(message){
      _this.__events.emit('webhook-event', message);
    }
  });
}

Thompson.prototype.addRepo = function(repo){

  var _this = this;
  _this.__webhook.addRepo(repo);
};

Thompson.prototype.on = function(event, handler){
  var _this = this;

  return _this.__events.on(event, handler);
};

Thompson.prototype.offEvent = function(handle){
  var _this = this;

  return _this.__events.offEvent(handle);
};

Thompson.prototype.listen = function(){

  var _this = this;

  return new Promise(function(resolve, reject){

      if (!_this.__webhook.repos || _this.__webhook.repos.length == 0) return reject(new Error('no repos configured'));

      else {

        _this.__webhook.ensureRepos(function(e){

          if (e) return reject(e);

          return _this.__listener.listen(_this.__onWebHookEvent.bind(_this), function(e){

            if (e) return reject(e);

            resolve();
          });
        })
      }
  });
};

Thompson.prototype.test = function(){

  var _this = this;
  return _this.__listener.test();
};



module.exports = Thompson;