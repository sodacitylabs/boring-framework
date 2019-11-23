"use strict";

module.exports = {
  Controller: {
    RequestController: require("./RequestController")
  },
  Mailer: require("./Mailer"),
  Model: {
    ActiveRecord: require("./ActiveRecord")
  },
  Router: require("./RouterV2")
};
