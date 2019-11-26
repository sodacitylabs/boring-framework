const NewExpression = require("../../../../src/cli/Interpreter/Expressions/New");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "new"]);
  const expression = new NewExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("NewCommand");
});
