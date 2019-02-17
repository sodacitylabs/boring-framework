module.exports = class RequestController {
  get config() {
    return require(`${process.cwd()}/config`);
  }
};
