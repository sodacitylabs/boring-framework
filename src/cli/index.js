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
const TestExpression = require("./expressions/TestExpression");

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
    tree.push(new TestExpression());

    tree.forEach(expression => expression.interpret(context));

    const command = context.getOutput();
    command.execute(context);
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
})();
