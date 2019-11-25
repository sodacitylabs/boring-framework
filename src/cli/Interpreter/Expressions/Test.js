const InterpreterExpression = require("../InterpreterExpression");
const TestCommand = require("../../Command/Test");

module.exports = class TestExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "test") {
      context.setOutput(new TestCommand());
    }
  }
};
