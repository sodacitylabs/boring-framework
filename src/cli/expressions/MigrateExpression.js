const InterpreterExpression = require("./InterpreterExpression");
const MigrateCommand = require("../commands/MigrateCommand");

module.exports = class MigrateExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "migrate") {
      context.setOutput(new MigrateCommand());
    }
  }
};
