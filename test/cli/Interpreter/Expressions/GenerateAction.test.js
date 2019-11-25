const GenerateActionExpression = require("../../../../src/cli/Interpreter/Expressions/GenerateAction");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "generate", "action"]);
  const expression = new GenerateActionExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("GenerateActionCommand");
});
