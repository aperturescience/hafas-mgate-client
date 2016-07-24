var _ = require('lodash')
var moment = require('moment-timezone')

const CAT_CODES = {
  2: 'Train',
  9: 'Bus',
  10: 'Tram'
}

function board (resp) {
  resp = _.get(resp, 'svcResL[0].res')
  var departures = resp.jnyL
  var contexts = resp.common.prodL
  var locations = resp.common.locL

  return _.map(departures, dep => {
    // get the "Context" (train, tram, bus, etc.)
    var ctx = contexts[parseInt(dep.stbStop.dProdX, 10)]

    // get the departure / arrival location
    var loc = locations[parseInt(dep.stbStop.locX, 10)]

    // get the transport type
    var type = CAT_CODES[parseInt(ctx.prodCtx.catCode, 10)]

    var leaves = moment(dep.stbStop.dTimeS, 'HHmmss')
    var withDelay = moment(dep.stbStop.dTimeR, 'HHmmss')

    // delay van only be calculated for train traffic,
    // other transport will produce 'null'
    var delay = withDelay.diff(leaves, 'minutes') || 0

    return {
      to: dep.dirTxt,
      delay: delay,
      leaves: leaves,
      leaves_relative: leaves.fromNow(),
      departs: type === 'Train'
        ? `Platform ${dep.stbStop.dPlatfS}`
        : loc.name,
      context: {
        name: ctx.name,
        number: ctx.number,
        line: ctx.line,
        type: type
      }
    }
  })
}

module.exports = {
  board: board
}
