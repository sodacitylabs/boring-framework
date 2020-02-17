const fs = require("fs");
const { spawnSync } = require("child_process");
const Command = require("./Command");
const ProcessHelper = require("../../core/helpers/ProcessHelper");
const NounHelper = require("../../core/helpers/NounHelper");

module.exports = class GenerateModelCommand extends Command {
  execute(context) {
    const { rootDirectory, modelName, modelAttributes } = requireArguments(
      context
    );

    createMigration(rootDirectory, modelName, modelAttributes);
    createModel(rootDirectory, modelName, modelAttributes);
    createModelTest(rootDirectory, modelName);
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
  let modelName = inputs[2];

  if (!modelName) {
    throw new Error("model name is required");
  }

  if (modelName[0] !== modelName[0].toUpperCase()) {
    modelName = modelName[0].toUpperCase() + modelName.substring(1);
  }

  modelName = NounHelper.getSingularForm(modelName);

  if (!fs.existsSync(`${rootDirectory}/db/migrations`)) {
    throw new Error(`Cannot create models without a migrations folder.`);
  }

  // todo: verify all attrs are of supported type
  const modelAttributes = inputs.slice(3).map(attr => {
    const pair = attr.split(":");
    return {
      name: pair[0],
      type: pair[1]
    };
  });

  return {
    rootDirectory,
    modelName,
    modelAttributes
  };
}

/**
 * @function generateMigrationFilePath
 * @private
 * @description generates the full migration file name path with timestamp prepended
 *
 * @param {*} rootDirectory
 * @param {*} modelName
 *
 * @throws {Error}
 * @returns {String} migration file path
 */
function generateMigrationFilePath(rootDirectory, modelName) {
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
  const migrationFilePath = `${rootDirectory}/db/migrations/${timestamp}_create_${NounHelper.toPluralResource(
    modelName
  )}.js`;

  return migrationFilePath;
}

function createMigration(rootDirectory, modelName, modelAttributes) {
  const migrationFile = generateMigrationFilePath(rootDirectory, modelName);
  const tableName = NounHelper.toPluralResource(modelName);
  let belongsTo = [];

  fs.writeFileSync(
    migrationFile,
    `
    exports.up = async function(knex) {
      await knex.schema.dropTableIfExists('${tableName}');
      await knex.schema.createTable('${tableName}', (table) => {
        table.bigIncrements('id').primary();
        ${modelAttributes.reduce((acc, curr) => {
          if (curr.type !== "references") {
            acc += `table.${curr.type}('${curr.name}');\n`;
          }

          if (curr.type === "references") {
            belongsTo.push(`${curr.name}`);

            acc += `table.bigInteger('${NounHelper.toSingularResource(
              curr.name
            )}').notNullable();\n`;

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
        modelName
      )}');
    };
    `,
    "utf8"
  );

  spawnSync(
    `${rootDirectory}/node_modules/.bin/prettier "${migrationFile}" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    }
  );
}

function createModel(rootDirectory, modelName, modelAttributes) {
  const modelFile = `${rootDirectory}/app/models/${modelName}.js`;
  let belongsTo = [];

  modelAttributes.forEach(attr => {
    if (attr.type === "references") {
      belongsTo.push(`${attr.name}`);
    }
  });

  const belongsToImports = belongsTo.length
    ? belongsTo.reduce(
        (acc, curr) => (acc += `const ${curr} = require('./${curr}')\n`),
        ""
      )
    : "";
  const belongsToRelations = belongsTo.length
    ? buildBelongsToRelation(modelName, belongsTo)
    : "";

  fs.writeFileSync(
    modelFile,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const ActiveRecord = Boring.Model.ActiveRecord;
    ${belongsToImports}

    module.exports = class ${modelName} extends ActiveRecord {
      ${belongsToRelations}
    };
    `,
    "utf8"
  );

  spawnSync(
    `${rootDirectory}/node_modules/.bin/prettier "${modelFile}" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    }
  );
}

function createModelTest(rootDirectory, modelName) {
  const modelTestFile = `${rootDirectory}/test/models/${modelName}.test.js`;

  fs.writeFileSync(
    modelTestFile,
    `
    const Model = require('../../app/models/${modelName}.js');

    test('empty test', () => {
      throw new Error('implement me');
    });
    `,
    "utf8"
  );

  spawnSync(
    `${rootDirectory}/node_modules/.bin/prettier "${modelTestFile}" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    }
  );
}

/**
 *
 * @param {*} sourceModel the source model ie. "Comment"
 * @param {*} relatedModels array of related models ie. ["BlogPost"]
 */
function buildBelongsToRelation(sourceModel, relatedModels) {
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
