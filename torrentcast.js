var readTorrent = require('read-torrent'),
  bodyParser = require('body-parser'),
  peerflix = require('peerflix'),
  uuid = require('node-uuid'),
  app = require('express')(),
  omx = require('omxctrl'),
  fs = require('fs'),
  tempDir = '/tmp/',
  engine;

var STATES = ['PLAYING', 'PAUSED', 'IDLE'];
var PORT = process.argv[2] || 9090;

var mappings = {
  '/pause': 'pause',
  '/speedup': 'increaseSpeed',
  '/speeddown': 'decreaseSpeed',
  '/nextaudio': 'nextAudioStream',
  '/prevaudio': 'previousAudioStream',
  '/nextsubtitle': 'nextSubtitleStream',
  '/prevsubtitle': 'previousSubtitleStream',
  '/togglesubtitle': 'toggleSubtitles',
  '/volumeup': 'increaseVolume',
  '/volumedown': 'decreaseVolume',
  '/forward': 'seekForward',
  '/backward': 'seekBackward',
  '/fastforward': 'seekFastForward',
  '/fastbackward': 'seekFastBackward'
};

app.use(bodyParser());

var stop = function() {
  if (!engine) return;
  engine.destroy();
  engine = null;
};

var createTempFilename = function() {
  return tempDir + 'torrentcast_' + uuid.v4();
};

var clearTempFiles = function() {
  fs.readdir(tempDir, function(err, files) {
    if (err) return;
    files.forEach(function(file) {
      if (file.substr(0, 11) === 'torrentcast') {
        fs.rmdir(tempDir + file);
      }
    });
  });
};

app.post('/play', function(req, res) {
  if (!req.body.url) return res.send(400, { error: 'torrent url missung' });
  readTorrent(req.body.url, function(err, torrent) {
    if (err) return res.send(400, { error: 'torrent link could not be parsed' });
    if (engine) stop();
    clearTempFiles();

    engine = peerflix(torrent, {
      connections: 100,
      path: createTempFilename(),
      buffer: (1.5 * 1024 * 1024).toString()
    });

    engine.server.on('listening', function() {
      omx.play('http://127.0.0.1:' + engine.server.address().port + '/');
      res.send(200);
    });
  });
});

app.post('/stop', function(req, res) {
  stop();
  res.send(200);
});

app.get('/state', function(req, res) {
  res.send(200, STATES[omx.getState()]);
});

for (var route in mappings) {
  (function(method) {
    app.post(route, function(req, res) {
      omx[method]();
      res.send(200);
    });
  })(mappings[route]);
}


module.exports = function() {
  console.log('torrentcast running on port', PORT);
  app.listen(PORT);
};