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
  expect(message.repo.name).to.be('happner/thompson');
  expect(message.event).to.be('push');
  //do something custom
});

thompson
  //add a single repo to watch
  .addRepo({
    name:'happner/thompson'
  })

  .then(function(){
    //add a multiple repos to watch
    return thompson.addRepo([{
      name:'herge/haddock'
    },{
      name:'herge/tintin'
    }])
  })

  //then listen for webhook callbacks
  .then(thompson.listen())
  .then(function(){
    console.log('thompson is listening...');
  })
  .catch(function(e){
    console.log('oops...');
  });

```


## License

MIT © [Happner](https://github.com/happner)
