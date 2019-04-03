const UnitTest = require("../../src/test/UnitTest");
const ResponseHelper = require("../../src/core/helpers/ResponseHelper");

module.exports = class ResponseHelperTest extends UnitTest {
  constructor() {
    super();
  }

  async "decorates request based on incoming http information"() {
    let res = {
      url: "http://www.test.com"
    };

    ResponseHelper.decorate(res, {
      projectDirectory: "/dir",
      controller: "Articles",
      action: "index",
      data: {}
    });

    this.assert(typeof res.redirectTo).equals("function");
    this.assert(typeof res.send).equals("function");
    this.assert(typeof res.render).equals("function");
  }

  async "throws if invalid context provided"() {
    let res = {
      url: "http://www.test.com"
    };

    try {
      ResponseHelper.decorate(res, {});
      return false;
    } catch (ex) {
      return true;
    }
  }
};
