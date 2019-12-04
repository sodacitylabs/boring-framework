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
const GenerateModelExpression = require("../../../src/cli/Interpreter/Expressions/GenerateModel");
const fs = require("fs");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no name provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "model"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if no migrations folder exists", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  try {
    ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
    fs.existsSync.mockImplementation(path => {
      if (path === `${fakeTestWorkingDirectory}/db/migrations`) {
        return false;
      }
    });

    interpretAndExecuteCommand(["$", "Boring", "generate", "model", "User"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("creates model, migration and test files", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/db/migrations`) {
      return true;
    }
  });

  interpretAndExecuteCommand([
    "$",
    "Boring",
    "generate",
    "model",
    "users", // will test the capitalization, singular form
    "name:string"
  ]);

  expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
  expect(child_process.spawnSync).toHaveBeenCalledTimes(3);

  const migrationFileWrite = fs.writeFileSync.mock.calls[0][0];
  expect(
    migrationFileWrite.indexOf(`${fakeTestWorkingDirectory}/db/migrations`)
  ).toBeGreaterThan(-1);
  expect(migrationFileWrite.indexOf(`create_users.js`)).toBeGreaterThan(-1);
  expect(fs.writeFileSync.mock.calls[1][0]).toBe(
    `${fakeTestWorkingDirectory}/app/models/User.js`
  );
  expect(fs.writeFileSync.mock.calls[2][0]).toBe(
    `${fakeTestWorkingDirectory}/test/models/User.test.js`
  );
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new GenerateModelExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
