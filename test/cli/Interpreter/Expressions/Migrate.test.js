const MigrateExpression = require("../../../../src/cli/Interpreter/Expressions/Migrate");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "migrate"]);
  const expression = new MigrateExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("MigrateCommand");
});
