const GenerateMigrationExpression = require("../../../../src/cli/Interpreter/Expressions/GenerateMigration");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext([
    "$",
    "Boring",
    "generate",
    "migration"
  ]);
  const expression = new GenerateMigrationExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("GenerateMigrationCommand");
});
