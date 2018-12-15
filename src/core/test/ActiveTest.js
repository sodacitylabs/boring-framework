const assert = require("assert");

module.exports = class ActiveTest {
  constructor() {}

  assert(val) {
    return {
      equals: function(other, msg) {
        return assert.strictEqual(val, other, msg);
      },
      deepEquals: function(other, msg) {
        return assert.deepStrictEqual(val, other, msg);
      },
      notEqualTo: function(other, msg) {
        return assert.notStrictEqual(val, other, msg);
      },
      notDeepEqualTo: function(other, msg) {
        return assert.notDeepStrictEqual(val, other, msg);
      },
      isTruthy: function() {
        return assert.ok(val);
      }
    };
  }
};
