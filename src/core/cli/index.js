"use strict";

/**
 * Logic for CLI commands.
 */
module.exports = function CLI() {
  return {
    generateAction: require("./generate/action"),
    generateController: require("./generate/controller"),
    generateModel: require("./generate/model"),
    newProject: require("./new"),
    showRoutes: require("./routes"),
    runTests: require("./test")
  };
};
