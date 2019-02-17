const assert = require("assert");
const request = require("request-promise-native");

function mapArgsToOptions(args) {
  let mapped = {};

  if (typeof args === "string") {
    mapped = {
      uri: args,
      followRedirect: false,
      followAllRedirects: false,
      resolveWithFullResponse: true,
      simple: false,
      transform: function(body, response) {
        return {
          headers: response.headers,
          status: {
            code: response.statusCode,
            message: response.statusMessage
          },
          body: response.body
        };
      }
    };
  } else {
    mapped = Object.assign({}, args, {
      followRedirect: false,
      followAllRedirects: false,
      resolveWithFullResponse: true,
      simple: false,
      transform: function(body, response) {
        return {
          headers: response.headers,
          status: {
            code: response.statusCode,
            message: response.statusMessage
          },
          body: response.body
        };
      }
    });
  }

  return mapped;
}

module.exports = class IntegrationTest {
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

  async delete(args) {
    return request.delete(mapArgsToOptions(args));
  }

  async get(args) {
    return request.get(mapArgsToOptions(args));
  }

  async post(args) {
    return request.post(mapArgsToOptions(args));
  }

  async put(args) {
    return request.put(mapArgsToOptions(args));
  }
};
