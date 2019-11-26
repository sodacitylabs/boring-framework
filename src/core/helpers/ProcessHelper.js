/**
 * @description Abstracts away the child_process module as well as other functions called throughout the codebase that are runtime-centric
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
};
