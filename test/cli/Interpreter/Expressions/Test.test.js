const TestExpression = require("../../../../src/cli/Interpreter/Expressions/Test");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "test"]);
  const expression = new TestExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("TestCommand");
});
