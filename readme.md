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
  "host": "0.0.0.0"
}

var thompson = new Thompson(options);

    thompson.on('webhook-event', function(message){
      console.log('have event back:::', message);
      done();
    });

    thompson
      //add one
      .addRepo({
        name:'happner/thompson'
      })
      //add many
      .then(thompson.addRepo([{
          name:'herge/haddock'
        },{
          name:'herge/tintin'
        }])
      )
      //then listen for webhook callbacks
      .then(thompson.listen())
      .catch(done);
```

## License

MIT © [Happner](https://github.com/happner)
