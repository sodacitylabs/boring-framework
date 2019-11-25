const InterpreterExpression = require("./InterpreterExpression");
const NewCommand = require("../commands/NewCommand");

module.exports = class NewExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "new") {
      context.setOutput(new NewCommand());
    }
  }
};
