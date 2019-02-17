"use strict";

module.exports = {
  Controller: require("./controller"),
  Mailer: require("./Mailer"),
  Model: {
    ActiveRecord: require("./ActiveRecord")
  },
  Test: require("./test")
};
