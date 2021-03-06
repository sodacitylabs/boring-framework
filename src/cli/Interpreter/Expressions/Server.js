const InterpreterExpression = require("../InterpreterExpression");
const ServerCommand = require("../../Command/Server");

module.exports = class ServerExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "server") {
      context.setOutput(new ServerCommand());
    }
  }
};
