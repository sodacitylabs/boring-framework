const Router = require("../src/core/RouterV2");
const Boring = require("../src/core");
const UnitTest = Boring.Test.UnitTest;

module.exports = class RouterTest extends UnitTest {
  constructor() {
    super();
  }

  async "creates new Router"() {
    const router = new Router({}, "/dir");

    this.assert(typeof router).equals("object");
    this.assert(typeof router.incoming).equals("function");
  }

  async "throws if no project config provided"() {
    try {
      new Router();

      return false;
    } catch (ex) {
      return true;
    }
  }

  async "throws if no project directory provided"() {
    try {
      new Router({});

      return false;
    } catch (ex) {
      return true;
    }
  }
};
