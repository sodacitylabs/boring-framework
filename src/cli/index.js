#!/usr/bin/env node

const InterpreterContext = require("./Interpreter/InterpreterContext");
const ServerExpression = require("./Interpreter/Expressions/Server");
const NewExpression = require("./Interpreter/Expressions/New");
const GenerateControllerExpression = require("./Interpreter/Expressions/GenerateController");
const GenerateActionExpression = require("./Interpreter/Expressions/GenerateAction");
const RoutesExpression = require("./Interpreter/Expressions/Routes");
const GenerateModelExpression = require("./Interpreter/Expressions/GenerateModel");
const GenerateMigrationExpression = require("./Interpreter/Expressions/GenerateMigration");
const MigrateExpression = require("./Interpreter/Expressions/Migrate");
const TestExpression = require("./Interpreter/Expressions/Test");

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
