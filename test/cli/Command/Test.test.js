jest.mock("../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("child_process", () => {
  return {
    spawn: jest.fn().mockImplementation(() => {}),
    spawnSync: jest.fn().mockImplementation(() => {})
  };
});

const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const TestExpression = require("../../../src/cli/Interpreter/Expressions/Test");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("executes test command in a separate process", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);

  interpretAndExecuteCommand(["$", "Boring", "test"]);

  expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
  expect(child_process.spawnSync).toHaveBeenCalledWith(
    `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: fakeTestWorkingDirectory
    }
  );
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new TestExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
