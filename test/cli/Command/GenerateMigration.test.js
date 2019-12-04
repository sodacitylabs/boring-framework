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
const GenerateMigrationExpression = require("../../../src/cli/Interpreter/Expressions/GenerateMigration");
const fs = require("fs");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no name provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "migration"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if no migrations folder", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  try {
    ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
    fs.existsSync.mockImplementation(path => {
      if (path === `${fakeTestWorkingDirectory}/db/migrations`) {
        return false;
      }
    });

    interpretAndExecuteCommand(["$", "Boring", "generate", "migration"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("writes migration file", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/db/migrations`) {
      return true;
    }
  });
  fs.writeFileSync.mockImplementation(path => {
    expect(
      path.indexOf(`${fakeTestWorkingDirectory}/db/migrations`)
    ).toBeGreaterThan(-1);
    expect(path.indexOf("fake_test.js")).toBeGreaterThan(-1);
  });

  interpretAndExecuteCommand([
    "$",
    "Boring",
    "generate",
    "migration",
    "fake_test"
  ]);

  expect(fs.existsSync).toHaveBeenCalledTimes(1);
  expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new GenerateMigrationExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
