const InterpreterExpression = require("../InterpreterExpression");
const NewCommand = require("../../Command/New");

module.exports = class NewExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "new") {
      context.setOutput(new NewCommand());
    }
  }
};
