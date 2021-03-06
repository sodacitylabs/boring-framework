const InterpreterExpression = require("../InterpreterExpression");
const GenerateModelCommand = require("../../Command/GenerateModel");

module.exports = class GenerateModelExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "generate" && inputs[1].trim() === "model") {
      context.setOutput(new GenerateModelCommand());
    }
  }
};
