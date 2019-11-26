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
    require: jest.fn().mockImplementation(() => {}),
    spawn: jest.fn().mockImplementation(() => {}),
    spawnSync: jest.fn().mockImplementation(() => {})
  };
});

const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const NewExpression = require("../../../src/cli/Interpreter/Expressions/New");
const fs = require("fs");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no name provided", () => {
  const context = new InterpreterContext(["$", "Boring", "new"]);
  const expression = new NewExpression();

  expression.interpret(context);

  const command = context.getOutput();

  try {
    command.execute(context);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if directory already exists", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => true);

  const context = new InterpreterContext(["$", "Boring", "new", "fake"]);
  const expression = new NewExpression();

  expression.interpret(context);

  const command = context.getOutput();

  try {
    command.execute(context);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("creates new project", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/fake`) {
      return false;
    }
  });
  fs.readFileSync.mockImplementation(path => {
    if (path.indexOf(".nvmrc") !== -1) {
      return `v12.7.0`;
    }
  });
  console.log = jest.fn(); // eslint-disable-line

  const context = new InterpreterContext(["$", "Boring", "new", "fake"]);
  const expression = new NewExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(fs.existsSync).toHaveBeenCalledTimes(1);
  expect(fs.mkdirSync).toHaveBeenCalledTimes(22);
  expect(fs.writeFileSync).toHaveBeenCalledTimes(23);
  expect(child_process.spawnSync).toHaveBeenCalledTimes(12);
});
