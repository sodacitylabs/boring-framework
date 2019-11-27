const { spawnSync } = require("child_process");
const Command = require("./Command");
const fs = require("fs");
const ProcessHelper = require("../../core/helpers/ProcessHelper");
// const InterpreterContext = require("../Interpreter/InterpreterContext");
// const GenerateActionExpression = require("../Interpreter/Expressions/GenerateAction");

const creatingPrefix = `Creating  `;

module.exports = class GenerateControllerCommand extends Command {
  execute(context) {
    const { rootDirectory, controllerName } = validateArguments(context);

    createControllerFile(rootDirectory, controllerName);
    createTestControllerFile(rootDirectory, controllerName);

    // actionNames.slice(3).forEach(action => {
    //   const actionContext = new InterpreterContext([
    //     "$",
    //     "boring",
    //     "generate",
    //     "action",
    //     action,
    //     name
    //   ]);
    //   const actionExpression = new GenerateActionExpression();
    //   actionExpression.interpret(actionContext);

    //   const actionCommand = actionContext.getOutput();

    //   actionCommand.execute(actionContext);
    // });
  }
};

/**
 * @function createControllerFile
 * @private
 *
 * @param {string} rootDirectory - directory the new command was run from
 * @param {string} controllerName - name of the controller
 *
 * @throws {Error}
 * @returns {null}
 */
function createControllerFile(rootDirectory, controllerName) {
  const controllerFile = `${rootDirectory}/app/controllers/${controllerName}.js`;

  console.log(`${creatingPrefix} controller at ${controllerFile}`);

  fs.writeFileSync(
    `${controllerFile}`,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const RequestController = Boring.Controller.RequestController;

    module.exports = class ${controllerName}Controller extends RequestController {};
    `,
    "utf8"
  );

  spawnSync(
    `${rootDirectory}/node_modules/.bin/prettier "${controllerFile}" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    }
  );
}

/**
 * @function createTestControllerFile
 * @private
 *
 * @param {string} rootDirectory - directory the new command was run from
 * @param {string} controllerName - name of the controller
 *
 * @throws {Error}
 * @returns {null}
 */
function createTestControllerFile(rootDirectory, controllerName) {
  const testFile = `${rootDirectory}/test/controllers/${controllerName}Controller.test.js`;

  console.log(`${creatingPrefix} test controller file at ${testFile}`);

  fs.writeFileSync(
    testFile,
    `
    test('empty test', () => {
      throw new Error('implement me');
    });
    `,
    "utf8"
  );

  spawnSync(
    `${rootDirectory}/node_modules/.bin/prettier "${testFile}" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    }
  );
}

/**
 * @function validateArguments
 * @private
 * @description check if all values are semantically valid
 *
 * @param {Context} context - the context object given
 *
 * @throws {Error}
 * @returns {null}
 */
function validateArguments(context) {
  const rootDirectory = ProcessHelper.cwd();
  const inputs = context.getInput();
  let controllerName = inputs[2];
  const actionNames = inputs.slice(3);

  // todo: normalize these better for multi-word, plurals etc.
  if (!controllerName) {
    throw new Error(`Generating a controller requires a controller name`);
  }

  if (controllerName[0] !== controllerName[0].toUpperCase()) {
    controllerName[0] = controllerName[0].toUpperCase();
  }

  if (fs.existsSync(`${rootDirectory}/app/controllers/${controllerName}.js`)) {
    throw new Error(
      `Controller ${controllerName} already exists. Did you mean to create an action instead?`
    );
  }

  return {
    rootDirectory,
    controllerName,
    actionNames
  };
}
