'use strict'

var request = require('request-promise')
var parse = require('./parse')

var HafasClient = function (opts) {

  if (!opts.baseUrl) throw new Error('HafasClient requires "baseUrl"')
  else this.baseUrl = opts.baseUrl

  if (!opts.auth) throw new Error('HafasClient requires "auth"')
  else this.auth = opts.auth

  if (!opts.name) throw new Error('HafasClient requires "name"')
  this.clientName = opts.name
}

HafasClient.prototype.stationBoard = function (opts) {
  var stationId = opts.station

  var svcRequest = {
    'meth': 'StationBoard',
    'req': {
      'getPasslist': false,
      'stbLoc': {
        'extId': stationId,
        'type': 'S'
      },
      'maxJny': 20
    }
  }

  return this.makeRequest({
    svcReqL: [svcRequest]
  })
  .then(resp => parse.board(resp))
}

HafasClient.prototype.makeRequest = function (opts) {
  var defaultBody = {
    client: {
      name: this.clientName || ''
    },
    auth: {
      'aid': this.auth,
      'type': 'AID'
    },
    lang: 'eng',
    ver: '1.12'
  }

  var req = {
    url: this.baseUrl,
    body: Object.assign({}, defaultBody, opts),
    json: true
  }

  return request(req)
}

module.exports = HafasClient
