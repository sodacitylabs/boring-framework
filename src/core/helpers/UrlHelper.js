const querystring = require("querystring");
const url = require("url");

module.exports = class UrlHelper {
  static parse(requestUrl) {
    const urlObj = url.parse(requestUrl, true);
    const parsedHash =
      urlObj.hash && urlObj.hash.split("#").filter(s => s.length)[0];

    return Object.assign({}, urlObj, { hash: querystring.parse(parsedHash) });
  }
};
