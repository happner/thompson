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
*thompson is meant to be used as amodule in systems that depend on github events, the cli is just for testing purposes*
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

//first attach to the webhook event, this is when we receive an event from github
thompson.on('webhook-event', function (message) {
  console.log('have message yay!');
    //message in format:
  message_format = {
    event:message.event,//"[push/pull_request]"
    name:message.name,//"[name of repo, sans owner]"
    owner:message.owner,//"{owner name}"
    branch:message.branch,// "master! ..master!"
    detail:message.detail//"[push message raw]"
  };
});

//add some repos you want to watch, addRepo is synchronous, we just pushing them to the collection:

thompson
  //add one
  .addRepo({
    name: repo,
    events:['push']
  })

thompson
  //and/or many
  .addRepo([
    {
      name: repo,
      events:['push']
    },{
      name: repo,
      events:['push']
    }
  ])

//then listen for webhook callbacks, this call will create webhooks if the dont already exist, and receive a test message if they are being newly created
thompson.listen()

.then(function(){
  console.log('thompson is listeneing now and will emit "webhook-event" events after matching github activity');
})
.catch(function(e){
   console.log('oh dear, not spiffing at all...');
})

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
