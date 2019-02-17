"use strict";

module.exports = {
  Controller: {
    RequestController: require("./RequestController")
  },
  Mailer: require("./Mailer"),
  Model: {
    ActiveRecord: require("./ActiveRecord")
  },
  Test: {
    UnitTest: require("../test/UnitTest"),
    IntegrationTest: require("../test/IntegrationTest")
  }
};
