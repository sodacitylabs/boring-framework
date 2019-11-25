const Command = require("./Command");
const { spawnSync } = require("child_process");

module.exports = class TestCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    const dir = process.cwd();

    spawnSync(
      `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
      {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      }
    );
  }
};
