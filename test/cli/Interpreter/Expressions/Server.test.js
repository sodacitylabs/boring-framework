const ServerExpression = require("../../../../src/cli/Interpreter/Expressions/Server");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("ServerCommand");
});
