const InterpreterExpression = require("./InterpreterExpression");
const RoutesCommand = require("../commands/RoutesCommand");

module.exports = class RoutesExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "routes") {
      context.setOutput(new RoutesCommand());
    }
  }
};
