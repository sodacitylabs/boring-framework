const fs = require("fs");
const { spawnSync } = require("child_process");
const Command = require("./Command");

module.exports = class GenerateMigrationCommand extends Command {
  execute(context) {
    const dir = process.cwd();
    const inputs = context.getInput();
    const fileName = inputs[2];

    if (!fileName || !fileName.length) {
      throw new Error(`Cannot create migration without a filename.`);
    }

    // todo: check for whitespace in filename

    if (!fs.existsSync(`${dir}/db/migrations`)) {
      fs.mkdirSync(`${dir}/db/migrations`);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now
      .getMonth()
      .toString()
      .padStart(2, "0");
    const day = now
      .getDate()
      .toString()
      .padStart(2, "0");
    const hours = now
      .getHours()
      .toString()
      .padStart(2, "0");
    const minutes = now
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const seconds = now
      .getSeconds()
      .toString()
      .padStart(2, "0");
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const migrationFile = `${dir}/db/migrations/${timestamp}_${fileName}.js`;

    fs.writeFileSync(
      migrationFile,
      `
      exports.up = async (knex) => {
      };

      exports.down = async (knex) => {
      };
      `,
      "utf8"
    );

    spawnSync(`${dir}/node_modules/.bin/prettier "${migrationFile}" --write`, {
      stdio: `inherit`,
      shell: true,
      cwd: dir
    });
  }
};
