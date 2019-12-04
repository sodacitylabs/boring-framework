const fs = require("fs");
const { spawnSync } = require("child_process");
const Command = require("./Command");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class GenerateMigrationCommand extends Command {
  execute(context) {
    const { rootDirectory, fileName } = requireArguments(context);
    const migrationFileName = generateMigrationFilePath(
      rootDirectory,
      fileName
    );

    createMigrationFile(rootDirectory, migrationFileName);
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
  const fileName = inputs[2];

  if (!fileName || !fileName.length) {
    throw new Error(`Cannot create migration without a filename.`);
  }

  if (!fs.existsSync(`${rootDirectory}/db/migrations`)) {
    fs.mkdirSync(`${rootDirectory}/db/migrations`);
  }

  return {
    rootDirectory,
    fileName
  };
}

/**
 * @function generateMigrationFilePath
 * @private
 * @description generates the full migration file name path with timestamp prepended
 *
 * @param {*} rootDirectory
 * @param {*} fileName
 *
 * @throws {Error}
 * @returns {String} migration file path
 */
function generateMigrationFilePath(rootDirectory, fileName) {
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
  const migrationFilePath = `${rootDirectory}/db/migrations/${timestamp}_${fileName}.js`;

  return migrationFilePath;
}

function createMigrationFile(rootDirectory, path) {
  fs.writeFileSync(
    path,
    `
      exports.up = async (knex) => {
      };
      exports.down = async (knex) => {
      };
      `,
    "utf8"
  );

  spawnSync(`${rootDirectory}/node_modules/.bin/prettier "${path}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: rootDirectory
  });
}
