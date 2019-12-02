const Command = require("./Command");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class MigrateCommand extends Command {
  execute(context) {
    const { rootDirectory, direction } = requireArguments(context);
    const db = ProcessHelper.require(`${rootDirectory}/db`);

    if (direction === "up") {
      db.migrate
        .latest({
          directory: `${rootDirectory}/db/migrations`
        })
        .then(function() {
          console.log(`Done migrating db`);
          ProcessHelper.exit(0);
        });
    } else if (direction === "down") {
      db.migrate
        .rollback({
          directory: `${rootDirectory}/db/migrations`
        })
        .then(function() {
          console.log(`Done rolling back db`);
          ProcessHelper.exit(0);
        });
    }
  }
};

/**
 * @function requireArguments
 * @private
 * @description check if all values provided and are valid values
 *
 * @param {Context} context - the context object given
 *
 * @throws {Error}
 * @returns {null}
 */
function requireArguments(context) {
  const rootDirectory = ProcessHelper.cwd();
  const inputs = context.getInput();
  const direction = inputs[1] && inputs[1].toLowerCase();

  if (!direction) {
    throw new Error(`migration direction required.`);
  } else if (["up", "down"].indexOf(direction) === -1) {
    throw new Error(`migration direction of ${direction} is not supported.`);
  }

  return {
    rootDirectory,
    direction
  };
}
