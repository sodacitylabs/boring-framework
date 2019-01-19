"use strict";

const fs = require("fs");
const { spawnSync } = require("child_process");

module.exports = async function(dir, fileName) {
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
};
