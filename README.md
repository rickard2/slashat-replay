# Slashat Chat Replay

[![Code Climate](https://codeclimate.com/github/rickard2/slashat-replay.png)](https://codeclimate.com/github/rickard2/slashat-replay)
[![Build Status](https://travis-ci.org/rickard2/slashat-replay.png?branch=master)](https://travis-ci.org/rickard2/slashat-replay)

Häng med i vad som sades i chatten i efterhand. 


### För användare
https://barney.0x539.se/slashat-replay/


### Utveckling

````
$ bower install
$ npm install
$ grunt watch emberTemplates
````

### Deployment

````
$ (ovanstående)
$ grunt build
````

### Fylla på med data

1. Lägg till nya avsnittet i `data/episodes.json`
2. Lägg till loggen i `data/[avsnittets youtube id].json`
3. Pull request
4. Party
