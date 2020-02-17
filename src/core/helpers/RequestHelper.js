const _ = require("lodash");
const CookieHelper = require("./CookieHelper");

module.exports = class RequestHelper {
  static decorate(req) {
    const cookieObj = CookieHelper.parse(req);

    _.merge(
      req,
      {
        cookies: cookieObj
      },
      {
        isBrowserRequest:
          (_.get(req, "headers.accept") || "").indexOf("html") !== -1,
        isApiRequest:
          (_.get(req, "headers.accept") || "").indexOf("json") !== -1
      }
    );
  }
};
