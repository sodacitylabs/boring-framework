const GenerateControllerExpression = require("../../../../src/cli/Interpreter/Expressions/GenerateController");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext([
    "$",
    "Boring",
    "generate",
    "controller"
  ]);
  const expression = new GenerateControllerExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe(
    "GenerateControllerCommand"
  );
});
