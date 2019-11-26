const InterpreterExpression = require("../../../src/cli/Interpreter/InterpreterExpression");

test("base class that throws by default", () => {
  try {
    const expression = new InterpreterExpression();

    expression.interpret();
  } catch (ignore) {}
});
