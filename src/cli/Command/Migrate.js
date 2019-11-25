const Command = require("./Command");

module.exports = class NewCommand extends Command {
  execute(context) {
    const dir = process.cwd();
    const inputs = context.getInput();
    const direction = inputs[1];
    const db = require(`${dir}/db`);

    if (direction === "up") {
      db.migrate
        .latest({
          directory: `${dir}/db/migrations`
        })
        .then(function() {
          console.log(`Done migrating db`);
          process.exit(0);
        });
    } else if (direction === "down") {
      db.migrate
        .rollback({
          directory: `${dir}/db/migrations`
        })
        .then(function() {
          console.log(`Done rolling back db`);
          process.exit(0);
        });
    } else {
      throw new Error(`migration direction of ${direction} is not supported.`);
    }
  }
};
