"use strict";

const fs = require("fs");
const pluralize = require("pluralize");
const { spawnSync } = require("child_process");

function getNameForms(name) {
  const singular = pluralize.singular(name);
  const plural = pluralize.plural(name);

  // todo: should only need to make this pass 1 time
  const resourceSingular = singular.split("").reduce((acc, curr, idx) => {
    if (curr === curr.toUpperCase() && idx !== 0) {
      acc += `_${curr.toLowerCase()}`;
    } else if (idx === 0) {
      acc += curr.toLowerCase();
    } else {
      acc += curr;
    }

    return acc;
  }, "");
  const resourcePlural = plural.split("").reduce((acc, curr, idx) => {
    if (curr === curr.toUpperCase() && idx !== 0) {
      acc += `_${curr.toLowerCase()}`;
    } else if (idx === 0) {
      acc += curr.toLowerCase();
    } else {
      acc += curr;
    }

    return acc;
  }, "");

  return {
    singular,
    plural,
    resourceSingular,
    resourcePlural
  };
}

module.exports = async function(dir, name, attrs) {
  if (name[0] !== name[0].toUpperCase()) {
    name = name[0].toUpperCase() + name.substring(1);
  }

  const forms = getNameForms(name);

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
  const migrationFile = `${dir}/db/migrations/${timestamp}_create_${
    forms.resourcePlural
  }.js`;
  const modelFile = `${dir}/app/models/${forms.singular}.js`;
  const modelTestFile = `${dir}/test/models/${forms.singular}Test.js`;

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
      await knex.schema.dropTableIfExists('${forms.resourcePlural}');
      await knex.schema.createTable('${forms.resourcePlural}', (table) => {
        table.uuid('id').primary();
        ${attrs.reduce((acc, curr) => {
          if (curr.type !== "references") {
            acc += `table.${curr.type}('${curr.name}');\n`;
          }

          if (curr.type === "references") {
            const belongsToForms = getNameForms(curr.name);
            belongsTo.push(`${belongsToForms.resourcePlural}`);
            acc += `table.uuid('${
              belongsToForms.resourceSingular
            }_id').notNullable();\n`;
            acc += `table.foreign("${
              belongsToForms.resourceSingular
            }_id").references("id").inTable("${
              belongsToForms.resourcePlural
            }");\n`;
          }

          return acc;
        }, "")}
        table.timestamps(true, true);
      });
    };

    exports.down = async function(knex) {
      await knex.schema.dropTableIfExists('${forms.resourcePlural}');
    };
    `,
    "utf8"
  );

  fs.writeFileSync(
    modelFile,
    `
    const db = require('../../db');
    const Boring = require('@sodacitylabs/boring-framework');
    const ActiveRecord = Boring.Model.ActiveRecord;

    module.exports = class ${forms.singular} extends ActiveRecord {
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
    const ActiveTest = Boring.Test.ActiveTest;

    module.exports = class ${forms.singular}Test extends ActiveTest {
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
