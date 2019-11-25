const fs = require("fs");
const { spawnSync } = require("child_process");
const NounHelper = require("../../core/helpers/NounHelper");
const Command = require("./Command");

module.exports = class GenerateModelCommand extends Command {
  execute(context) {
    const dir = process.cwd();
    const inputs = context.getInput();
    let name = inputs[2];
    const attrs = inputs.slice(3).map(attr => {
      const pair = attr.split(":");
      return {
        name: pair[0],
        type: pair[1]
      };
    });

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
    const modelFile = `${dir}/app/models/${NounHelper.getSingularForm(
      name
    )}.js`;
    const modelTestFile = `${dir}/test/models/${NounHelper.getSingularForm(
      name
    )}.test.js`;

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

    const tableName = NounHelper.toPluralResource(name);
    const modelName = NounHelper.getSingularForm(name);

    fs.writeFileSync(
      migrationFile,
      `
      exports.up = async function(knex) {
        await knex.schema.dropTableIfExists('${tableName}');
        await knex.schema.createTable('${tableName}', (table) => {
          table.bigIncrements('id').primary();
          ${attrs.reduce((acc, curr) => {
            if (curr.type !== "references") {
              acc += `table.${curr.type}('${curr.name}');\n`;
            }

            if (curr.type === "references") {
              belongsTo.push(`${curr.name}`);

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

    const belongsToRelations =
      belongsTo.length && _buildBelongsToRelation(modelName, belongsTo);

    fs.writeFileSync(
      modelFile,
      `
      const Boring = require('@sodacitylabs/boring-framework');
      const ActiveRecord = Boring.Model.ActiveRecord;
      ${(belongsTo.length &&
        belongsTo.reduce(
          (acc, curr) => (acc += `const ${curr} = require('./${curr}')\n`)
        ),
      "")}

      module.exports = class ${modelName} extends ActiveRecord {
        ${belongsTo.length && belongsToRelations}
      };
      `,
      "utf8"
    );

    fs.writeFileSync(
      modelTestFile,
      `
      const Model = require('../../app/models/${NounHelper.getSingularForm(
        name
      )}.js');

      test('returns false', () => {
        return false;
      });
      `,
      "utf8"
    );

    // TODO: write the inverse relation mapping to the parent?

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
  }
};

/**
 *
 * @param {*} sourceModel the source model ie. "Comment"
 * @param {*} relatedModels array of related models ie. ["BlogPost"]
 */
function _buildBelongsToRelation(sourceModel, relatedModels) {
  const relationsAsString = relatedModels.reduce((acc, curr) => {
    const camelizedRelatedModelName = NounHelper.getCamelCaseSingularForm(curr);
    const sourceTableName = NounHelper.toPluralResource(sourceModel);
    const relatedIdColumnName = `${NounHelper.toSingularResource(curr)}_id`;
    const relatedTableName = NounHelper.toPluralResource(curr);

    acc += `
      ${camelizedRelatedModelName}: {
        relation: ActiveRecord.BelongsToOneRelation,
        modelClass: ${curr},
        join: {
          from: '${sourceTableName}.${relatedIdColumnName}',
          to: '${relatedTableName}.id'
        }
      }
    `;

    return acc;
  }, "");

  return `
    static get relationMappings() {
      return {
        ${relationsAsString}
      };
    };
  `;
}
