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
  "url": "http://www.thompson.com:55555",
  "token": "08254aa9a4a60bbb497164c42a7542efbcad805a",
  "secret": "YYTAAG4562fDSsa",
  "host": "0.0.0.0"
}

var thompson = new Thompson(options);

thompson.addRepo({repo:'happner/thompson',
                  events: ["push"],
                  handler:function(message, callback){

                  }});

thompson.addRepo({repo:'/thompson',
                  events: ["push"],
                  handler:function(message, callback){

                  }});

thompson.listen();

```


## License

MIT © [Happner](https://github.com/happner)
