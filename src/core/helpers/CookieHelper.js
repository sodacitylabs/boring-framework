module.exports = class CookieHelper {
  static parse(req) {
    try {
      return (
        req &&
        req.headers &&
        req.headers.cookie &&
        req.headers.cookie.split(";").reduce((acc, curr) => {
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
