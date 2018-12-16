const Boring = require("../../src/core");
const UnitTest = Boring.Test.UnitTest;

module.exports = class ActiveRecordTest extends UnitTest {
  constructor() {
    super();
  }

  async "returns true"() {
    return this.assert(true).equals(true, "true should equal true");
  }
};
