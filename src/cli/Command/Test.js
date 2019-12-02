const Command = require("./Command");
const { spawnSync } = require("child_process");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class TestCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    spawnSync(
      `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
      {
        stdio: `inherit`,
        shell: true,
        cwd: ProcessHelper.cwd()
      }
    );
  }
};
