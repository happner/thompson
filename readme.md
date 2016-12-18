# Thompson [![Build Status](https://travis-ci.org/happner/thompson.svg?branch=master)](https://travis-ci.org/happner/thompson)

<h1 align="center">
  <br>
  <img width="200" src="media/logo.png">
  <br>
  <br>
</h1>


## Purpose

Thompson sets up [github webhooks](https://developer.github.com/webhooks/) and listens for events on the webhooks, all he needs is a [github token](https://github.com/settings/tokens/new), an external address which he listens on, and a list of repos to attach his cane to.

Special thanks to:
 - [pksunkara](https://github.com/pksunkara/octonode)
 - [nlf](https://github.com/nlf/node-github-hook)

## Installation

```
$ npm install thompson --save
```

## Usage

###programmatic:

```javascript

var Thompson = require('thompson');

var options = {
  "url": "[external url you want webhooks to attach to]",
  "token": "[github api token]",
  "secret": "[secret to ensure you dont get anyone else pushing spurious events]",
  "host": "0.0.0.0",
  "events": ["push"]
}

var thompson = new Thompson(options);

  thompson.on('webhook-event', function (message) {
    console.log('have message yay!');
    //message in format:
    {
        event:"[push/pull_request]",
        name:"[name of repo, sans owner]",
        owner:"{owner name}",
        branch: "master??",
        detail:"[cpush detail]"
      };
  });

  thompson
  //add one
  .addRepo({
    name: repo,
    events:['push']
  })
  //then listen for webhook callbacks
  .then(

    thompson.listen()

    .then(function(){
      util.log.success('watching ' + repo + ' for ' + events.join(',') + ' event(s) on url ' + url);
    })
    .catch(function(e){
      util.log.error('FAILURE LISTENING TO REPO:::' + repo);
    })
  ).catch(function(e){
    util.log.error('FAILURE LISTENING TO REPO:::' + repo);
  });
```

###CLI:
*just for testing purposes ATM, as we cannot attach events to actual external scripts yet, just prints out incoming events related to webhooks thompson has created*
###Global:
```bash
> npm install thompson -g
> thompson  -r [repo owner]/[repo name] -t [github api token] -s [github webhooks secret] -u [url, not https yet] -e [events comma separated, ie:push,pull_request]
```

###Local:
```bash
> git clone https://github.com/happner/thompson.git
> cd thompson
> nodejs bin/thompson -r [repo owner]/[repo name] -t [github api token] -s [github webhooks secret] -u [url, not https yet] -e [events comma separated, ie:push,pull_request]
```

## License

MIT © [Happner](https://github.com/happner)
