const { spawnSync } = require("child_process");
const Command = require("./Command");
const fs = require("fs");
const InterpreterContext = require("../Interpreter/InterpreterContext");
const GenerateActionExpression = require("../Interpreter/Expressions/GenerateAction");

module.exports = class GenerateControllerCommand extends Command {
  execute(context) {
    const root = process.cwd();
    const inputs = context.getInput();
    let name = inputs[2];
    const creatingPrefix = `Creating  `;

    // todo: normalize these better for multi-word, plurals etc.

    if (!name) {
      throw new Error(`Generating a controller requires a controller name`);
    }

    if (name[0] !== name[0].toUpperCase()) {
      name[0] = name[0].toUpperCase();
    }

    // todo: get all file names and check for non-normalize and normalized versions
    if (name && fs.existsSync(`${root}/app/controllers/${name}.js`)) {
      throw new Error(
        `Controller ${name} already exists. Did you mean to create an action instead?`
      );
    }

    console.log(
      `${creatingPrefix} controller at ${root}/app/controllers/${name}.js`
    );

    fs.writeFileSync(
      `${root}/app/controllers/${name}.js`,
      `
      const Boring = require('@sodacitylabs/boring-framework');
      const RequestController = Boring.Controller.RequestController;

      module.exports = class ${name}Controller extends RequestController {};
      `,
      "utf8"
    );

    const testFile = `${root}/test/controllers/${name}Controller.test.js`;

    fs.writeFileSync(
      testFile,
      `
      test('returns false', async () => {
        return false;
      });
      `,
      "utf8"
    );

    spawnSync(
      `${root}/node_modules/.bin/prettier "${root}/app/controllers/${name}.js" --write`,
      {
        stdio: `inherit`,
        shell: true,
        cwd: root
      }
    );
    spawnSync(`${root}/node_modules/.bin/prettier "${testFile}" --write`, {
      stdio: `inherit`,
      shell: true,
      cwd: root
    });

    inputs.slice(3).forEach(action => {
      const actionContext = new InterpreterContext([
        "$",
        "boring",
        "generate",
        "action",
        action,
        name
      ]);
      const actionExpression = new GenerateActionExpression();
      actionExpression.interpret(actionContext);

      const actionCommand = actionContext.getOutput();

      actionCommand.execute(actionContext);
    });
  }
};
