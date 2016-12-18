# Thompson [![Build Status](https://travis-ci.org/happner/thompson.svg?branch=master)](https://travis-ci.org/happner/thompson)

<h1 align="center">
  <br>
  <img width="200" src="media/logo.png">
  <br>
  <br>
</h1>


## Purpose

Thompson sets up github webhooks and listens for events on the webhooks, all he needs is a github token, an external address which he listens on, and a list of repos to attach his cane to.

## Installation

```
$ npm install thompson --save
```

## Usage

```javascript

var Thompson = require('thompson');

var options = {
  "url": "[external url you want webhooks to attach to]",
  "token": "[token]",
  "secret": "[secret to ensure you dont get anyone else pushing spurious events]",
  "host": "0.0.0.0",
  "events": ["push","pull"]
}

var thompson = new Thompson(options);

    thompson.on('webhook-event', function(message){

      //event message is in the following format:
      // {}

      console.log('have event back:::', message);
    });

     thompson
      //add one
      .addRepo({
        name: 'thompson/my-repo'
      })
      .addRepo([{
        name: 'thompson/my-repo-2'
      },{
        name: 'thompson/my-repo-3'
      }])
      //then listen for webhook callbacks
      .then(

        thompson.listen()

        .then(function(){
          console.log('watching repos for ' + options.events.join(',') + ' event(s) on url ' + options.url);
        })
        .catch(function(e){
          console.log('FAILURE LISTENING:::', e);
        })
      ).catch(function(e){
       console.log('FAILURE LISTENING:::', e);
      });
```

## License

MIT © [Happner](https://github.com/happner)
