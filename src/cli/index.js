#!/usr/bin/env node

const InterpreterContext = require("./Interpreter/InterpreterContext");
const NewExpression = require("./Interpreter/Expressions/New");
const ServerExpression = require("./Interpreter/Expressions/Server");
const GenerateControllerExpression = require("./Interpreter/Expressions/GenerateController");
const GenerateActionExpression = require("./Interpreter/Expressions/GenerateAction");
const TestExpression = require("./Interpreter/Expressions/Test");
const MigrateExpression = require("./Interpreter/Expressions/Migrate");
const GenerateMigrationExpression = require("./Interpreter/Expressions/GenerateMigration");
const RoutesExpression = require("./Interpreter/Expressions/Routes");
const GenerateModelExpression = require("./Interpreter/Expressions/GenerateModel");

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
    tree.push(new GenerateMigrationExpression());
    tree.push(new RoutesExpression());
    tree.push(new GenerateModelExpression());
    tree.forEach(expression => expression.interpret(context));

    const command = context.getOutput();
    command.execute(context);
  } catch (ex) {
    console.error(ex);
  }
})();
