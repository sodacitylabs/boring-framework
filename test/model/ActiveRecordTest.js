const Boring = require("../../src/core");
const ActiveTest = Boring.Test.ActiveTest;

module.exports = class ActiveRecordTest extends ActiveTest {
  constructor() {
    super();
  }

  async "returns true"() {
    return this.assert(true).equals(true, "true should equal true");
  }
};
