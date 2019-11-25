#!/usr/bin/env node

const InterpreterContext = require("./InterpreterContext");
const ServerExpression = require("./expressions/ServerExpression");
const NewExpression = require("./expressions/NewExpression");
const GenerateControllerExpression = require("./expressions/GenerateControllerExpression");
const GenerateActionExpression = require("./expressions/GenerateActionExpression");
const RoutesExpression = require("./expressions/RoutesExpression");
const GenerateModelExpression = require("./expressions/GenerateModelExpression");
const GenerateMigrationExpression = require("./expressions/GenerateMigrationExpression");
const MigrateExpression = require("./expressions/MigrateExpression");

(async () => {
  try {
    const context = new InterpreterContext(process.argv);

    const tree = [];
    tree.push(new ServerExpression());
    tree.push(new NewExpression());
    tree.push(new GenerateControllerExpression());
    tree.push(new GenerateActionExpression());
    tree.push(new GenerateModelExpression());
    tree.push(new GenerateMigrationExpression());
    tree.push(new RoutesExpression());
    tree.push(new MigrateExpression());

    tree.forEach(expression => expression.interpret(context));

    const command = context.getOutput();
    command.execute(context);
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
})();

// switch (cmd) {
//   case "test":
//     runTests();
//     break;
//   default:
//     console.error(`Unknown command ${cmd} and args phrase`);
//     process.exit(1);
// }

// function runTests() {
//   try {
//     spawnSync(
//       `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
//       {
//         stdio: `inherit`,
//         shell: true,
//         cwd: dir
//       }
//     );
//   } catch (ex) {
//     console.error(`Error running tests: ${ex.message}`);
//     process.exit(1);
//   }
// }
