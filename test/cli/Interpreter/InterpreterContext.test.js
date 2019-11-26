const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");

test("throws if no arguments provided", () => {
  try {
    new InterpreterContext(["$", "Boring"]);

    throw new Error("should have thrown");
  } catch (ignore) {}
});

test("slices off first 2 arguments and sets input", () => {
  const context = new InterpreterContext(["$", "Boring", "server"]);

  expect(context.getInput()).toHaveLength(1);
});

test("throws if output set is not a Command", () => {
  const context = new InterpreterContext(["$", "Boring", "server"]);

  try {
    expect(context.getOutput()).toBeFalsy();

    context.setOutput({});

    throw new Error("should have thrown");
  } catch (ignore) {}
});
