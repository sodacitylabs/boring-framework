const fkill = require("fkill");

/**
 * @description Abstracts away globals for require-ing modules and dealing with global process
 */
module.exports = class ProcessHelper {
  static cwd() {
    return process.cwd();
  }
  static exit(code) {
    process.exit(code);
  }
  static require(path) {
    return require(path);
  }
  static async kill(args) {
    await fkill(args);
  }
};
