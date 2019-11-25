const InterpreterExpression = require("../InterpreterExpression");
const GenerateActionCommand = require("../../Command/GenerateAction");

module.exports = class GenerateActionExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "generate" && inputs[1].trim() === "action") {
      context.setOutput(new GenerateActionCommand());
    }
  }
};
