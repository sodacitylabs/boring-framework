#!/usr/bin/env node

const InterpreterContext = require("./Interpreter/InterpreterContext");
const NewExpression = require("./Interpreter/Expressions/New");
const ServerExpression = require("./Interpreter/Expressions/Server");
const GenerateControllerExpression = require("./Interpreter/Expressions/GenerateController");
const GenerateActionExpression = require("./Interpreter/Expressions/GenerateAction");
const TestExpression = require("./Interpreter/Expressions/Test");
const MigrateExpression = require("./Interpreter/Expressions/Migrate");

(async () => {
  try {
    const context = new InterpreterContext(process.argv);

    const tree = [];
    tree.push(new NewExpression());
    tree.push(new ServerExpression());
    tree.push(new GenerateControllerExpression());
    tree.push(new GenerateActionExpression());
    tree.push(new TestExpression());
    tree.push(new MigrateExpression());
    tree.forEach(expression => expression.interpret(context));

    const command = context.getOutput();
    command.execute(context);
  } catch (ex) {
    console.error(ex);
  }
})();

const [, , ...args] = process.argv;
const dir = process.cwd();
const cmd = args[0];

switch (cmd) {
  case "generate":
    generate();
    break;
  case "migrate":
    break;
  case "new":
    break;
  case "routes":
    showRoutes();
    break;
  case "server":
    break;
  case "test":
    break;
  default:
    console.error(`Unknown command ${cmd} and args phrase`);
    process.exit(1);
}

function generate() {
  try {
    if (!args[1]) {
      throw new Error("nothing to generate");
    }

    switch (args[1]) {
      case "action":
        break;
      case "controller":
        break;
      case "migration":
        generateMigration();
        break;
      case "model":
        generateModel();
        break;
      default:
        console.error(`Unknown argument ${args[1]} for generate command`);
        process.exit(1);
    }
  } catch (ex) {
    console.error(`Error generating: ${ex.message}`);
    process.exit(1);
  }
}

function generateMigration() {
  try {
    const fileName = args[2];

    require("./generate/migration")(dir, fileName);
  } catch (ex) {
    console.error(`Error creating a migration: ${ex.message}`);
    process.exit(1);
  }
}

function generateModel() {
  try {
    const model = args[2];
    const attrs = args.slice(3).map(attr => {
      const pair = attr.split(":");
      return {
        name: pair[0],
        type: pair[1]
      };
    });

    require("./generate/model")(dir, model, attrs);
  } catch (ex) {
    console.error(`Error creating a model: ${ex.message}`);
    process.exit(1);
  }
}

function showRoutes() {
  try {
    require("./routes")();
  } catch (ex) {
    console.error(`Error building routes: ${ex.message}`);
    process.exit(1);
  }
}
