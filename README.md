## torrentcast

torrentcast builds a REST API around [peerflix](https://github.com/mafintosh/peerflix) and [omxplayer](http://omxplayer.sconde.net/).
omxplayer is a commandline player especially build for usage on
a raspberry pi. peerflix on the otherhand is a small lib/tool written
for node which enables streaming of video torrents before they even finished
downloading.

### Installation

Make sure you have omxplayer and node.js installed on your
raspberry. Then run:

```
npm install torrentcast -g
```

You now now start the server by running ```torrentcast```.
By default it will spin up a HTTP Server listening on port 9090.

### Usage
```
// Assuming your Raspberry PI has the IP 192.168.0.10...

// Start playing a torrent
curl --data "url=<URL to Torrent File>" http://192.168.0.10:9090/play

// Toggle between pause and play
curl -XPOST http://192.168.0.10:9090/pause

// Stop playing
curl -XPOST http://192.168.0.10:9090/stop

// Increase volume
curl -XPOST http://192.168.0.10:9090/volumeup

// Decrease volume
curl -XPOST http://192.168.0.10:9090/volumedown

// Get the current State.
// Can be: PLAYING, PAUSED or IDLE
curl http://192.168.0.10:9090/state
```

## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.