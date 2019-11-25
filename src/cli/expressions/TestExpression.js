const InterpreterExpression = require("./InterpreterExpression");
const TestCommand = require("../commands/TestCommand");

module.exports = class TestExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "test") {
      context.setOutput(new TestCommand());
    }
  }
};
