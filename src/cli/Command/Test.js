const Command = require("./Command");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class TestCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    ProcessHelper.spawnSync(
      `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
      {
        stdio: `inherit`,
        shell: true,
        cwd: ProcessHelper.cwd()
      }
    );
  }
};
