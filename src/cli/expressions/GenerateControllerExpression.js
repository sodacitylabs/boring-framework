const InterpreterExpression = require("./InterpreterExpression");
const GenerateControllerCommand = require("../commands/GenerateControllerCommand");

module.exports = class GenerateControllerExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "generate" && inputs[1].trim() === "controller") {
      context.setOutput(new GenerateControllerCommand());
    }
  }
};
