const async = require('async')

module.exports = {
  matchingNibbleLength: matchingNibbleLength,
  callTogether: callTogether,
  asyncFirstSeries: asyncFirstSeries,
  doKeysMatch: doKeysMatch
}

/**
 * Returns the number of in order matching nibbles of two give nibble arrayes
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 */
function matchingNibbleLength (nib1, nib2) {
  var i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}

/**
 * Compare two 'nibble array' keys
 */
function doKeysMatch (keyA, keyB) {
  var length = matchingNibbleLength(keyA, keyB)
  return length === keyA.length && length === keyB.length
}

/**
 * Take two or more functions and returns a function  that will execute all of
 * the given functions
 */
function callTogether () {
  var funcs = arguments
  var length = funcs.length
  var index = length

  if (!length) {
    return function () {}
  }

  return function () {
    length = index

    while (length--) {
      var fn = funcs[length]
      if (typeof fn === 'function') {
        var result = funcs[length].apply(this, arguments)
      }
    }
    return result
  }
}

/**
 * Take a collection of async fns, call the cb on the first to return a truthy value.
 * If all run without a truthy result, return undefined
 *
 * TODO replace with async race / tryEach
 * intended behavior depends on swallowing any  error
 */
function asyncFirstSeries (array, processItem, cb) {
  var didComplete = false
  async.eachSeries(array, function (item, next) {
    if (didComplete) return next
    processItem(item, function (err, returnVal) {
      if (returnVal) {
        didComplete = true
        process.nextTick(cb.bind(null, null, returnVal))
      }
      next(err)
    })
  }, function (err) {
    if (!didComplete) {
      cb({'err': 'no result'})
    }
  })
}
