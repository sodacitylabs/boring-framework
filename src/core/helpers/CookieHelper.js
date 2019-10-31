const _ = require("lodash");

module.exports = class CookieHelper {
  static parse(req) {
    try {
      const cookies = _.get(req, "headers.cookie");

      return (
        cookies &&
        cookies.split(";").reduce((acc, curr) => {
          const cookie = curr.split("=");

          acc[cookie[0].trim()] = cookie[1].trim();

          return acc;
        }, {})
      );
    } catch (ex) {
      return {};
    }
  }
};
