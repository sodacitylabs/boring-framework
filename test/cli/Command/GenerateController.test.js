jest.mock("fs", () => {
  return {
    existsSync: jest.fn().mockImplementation(() => {}),
    mkdirSync: jest.fn().mockImplementation(() => {}),
    readFileSync: jest.fn().mockImplementation(() => {}),
    writeFileSync: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("child_process", () => {
  return {
    spawn: jest.fn().mockImplementation(() => {}),
    spawnSync: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {})
  };
});

const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const GenerateControllerExpression = require("../../../src/cli/Interpreter/Expressions/GenerateController");
const fs = require("fs");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no name provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "controller"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if file already exists", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => true);

  try {
    interpretAndExecuteCommand([
      "$",
      "Boring",
      "generate",
      "controller",
      "Fake"
    ]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("creates new controller file", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => {
    return false;
  });
  console.log = jest.fn(); // eslint-disable-line

  interpretAndExecuteCommand(["$", "Boring", "generate", "controller", "fake"]);

  expect(fs.existsSync).toHaveBeenCalledTimes(1);
  expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  expect(child_process.spawnSync).toHaveBeenCalledTimes(2);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new GenerateControllerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
