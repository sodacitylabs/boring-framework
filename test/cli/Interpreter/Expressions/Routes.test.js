const RoutesExpression = require("../../../../src/cli/Interpreter/Expressions/Routes");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "routes"]);
  const expression = new RoutesExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("RoutesCommand");
});
