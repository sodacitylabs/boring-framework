const InterpreterExpression = require("./InterpreterExpression");
const GenerateMigrationCommand = require("../commands/GenerateMigrationCommand");

module.exports = class GenerateMigrationExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "generate" && inputs[1].trim() === "migration") {
      context.setOutput(new GenerateMigrationCommand());
    }
  }
};
