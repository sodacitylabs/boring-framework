const GenerateModelExpression = require("../../../../src/cli/Interpreter/Expressions/GenerateModel");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");

test("if context input is correct, sets the proper command", () => {
  const context = new InterpreterContext(["$", "Boring", "generate", "model"]);
  const expression = new GenerateModelExpression();

  expression.interpret(context);

  expect(context.getOutput().constructor.name).toBe("GenerateModelCommand");
});
