"use strict";

const fs = require("fs");
const { spawnSync } = require("child_process");

const NounHelper = require("../../core/helpers").NounHelper;

module.exports = async function(dir, name, attrs) {
  if (name[0] !== name[0].toUpperCase()) {
    name = name[0].toUpperCase() + name.substring(1);
  }

  // todo: verify model name is singular and uppercased
  // todo: verify all attrs are of supported type

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
  const migrationFile = `${dir}/db/migrations/${timestamp}_create_${NounHelper.toPluralResource(
    name
  )}.js`;
  const modelFile = `${dir}/app/models/${NounHelper.getSingularForm(name)}.js`;
  const modelTestFile = `${dir}/test/models/${NounHelper.getSingularForm(
    name
  )}Test.js`;

  if (fs.existsSync(migrationFile)) {
    throw new Error(
      `Cannot create migration ${migrationFile} since it already exists.`
    );
  }

  if (fs.existsSync(modelFile)) {
    throw new Error(
      `Cannot create migration ${modelFile} since it already exists.`
    );
  }

  let belongsTo = [];

  fs.writeFileSync(
    migrationFile,
    `
    exports.up = async function(knex) {
      await knex.schema.dropTableIfExists('${NounHelper.toPluralResource(
        name
      )}');
      await knex.schema.createTable('${NounHelper.toPluralResource(
        name
      )}', (table) => {
        table.bigIncrements('id').primary();
        ${attrs.reduce((acc, curr) => {
          if (curr.type !== "references") {
            acc += `table.${curr.type}('${curr.name}');\n`;
          }

          if (curr.type === "references") {
            belongsTo.push(`${NounHelper.toPluralResource(curr.name)}`);
            acc += `table.bigInteger('${NounHelper.toSingularResource(
              curr.name
            )}_id').notNullable();\n`;
            acc += `table.foreign("${NounHelper.toSingularResource(
              curr.name
            )}_id").references("id").inTable("${NounHelper.toPluralResource(
              curr.name
            )}");\n`;
          }

          return acc;
        }, "")}
        table.timestamps(true, true);
      });
    };

    exports.down = async function(knex) {
      await knex.schema.dropTableIfExists('${NounHelper.toPluralResource(
        name
      )}');
    };
    `,
    "utf8"
  );

  fs.writeFileSync(
    modelFile,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const ActiveRecord = Boring.Model.ActiveRecord;

    module.exports = class ${NounHelper.getSingularForm(
      name
    )} extends ActiveRecord {
      constructor(attrs) {
        super(attrs);
      }
      ${
        belongsTo.length
          ? `get belongsTo() {
        return ${JSON.stringify(belongsTo)};
      }`
          : "get belongsTo() { return []; }"
      }
    };
    `,
    "utf8"
  );

  fs.writeFileSync(
    modelTestFile,
    `
    const db = require('../../db');
    const Boring = require('@sodacitylabs/boring-framework');
    const UnitTest = Boring.Test.UnitTest;

    module.exports = class ${NounHelper.getSingularForm(
      name
    )}Test extends UnitTest {
      constructor(attrs) {
        super(attrs);
      }

      // async "returns true"() {
      //   return this.assert(true).equals(true);
      // }

      // async "returns false"() {
      //   return this.assert(true).equals(false);
      // }
    };
    `,
    "utf8"
  );

  spawnSync(`${dir}/node_modules/.bin/prettier "${migrationFile}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: dir
  });
  spawnSync(`${dir}/node_modules/.bin/prettier "${modelFile}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: dir
  });
  spawnSync(`${dir}/node_modules/.bin/prettier "${modelTestFile}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: dir
  });
};
