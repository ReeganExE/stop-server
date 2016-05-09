var path = require('path')
var util = require('util')
var express = require('express')
var address = require('network-address')
var updateNotifier = require('update-notifier')
var powerOff = require('power-off')
var sleepMode = require('sleep-mode')
var bodyParser = require('body-parser')
var pkg = require('./package.json')

var app = express()
var notifier = updateNotifier({ pkg: pkg })

// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.delete('/', function (req, res) {
  res.end()
  util.log('exit')
  process.exit()
})

app.post('/power-off', function (req, res) {
  powerOff(function (err, stderr, stdout) {
    if (err) {
      util.log(err)
      res.status(500).json({ error: 'Can\'t run power-off' })
    } else {
      res.end()
    }
  })
})

app.post('/auth', function(req, res) {
  var config = require('./config.json');
  if (config.passcode === req.body.code) {
    res.end();
  } else {
    res.status(401).json({ error: 'Can\'t run power-off' })
  }
})

app.post('/sleep', function (req, res) {
  sleepMode(function (err, stderr, stdout) {
    if (err) {
      util.log(err)
      res.status(500).json({ error: 'Can\'t run sleep' })
    } else {
      res.end()
    }
  })
})

app.get('/address', function (req, res) {
  res.json({ address: address() })
})

app.get('/update', function (req, res) {
  updateNotifier({
    pkg: pkg,
    callback: function (err, update) {
      if (err) return res.json({})
      res.json(update)
    }
  })
})

var port = 5709

app.listen(port, function () {
  util.log('stop-server listening on port ' + port)
})
