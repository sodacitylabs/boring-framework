jest.mock("../../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: () => {},
    spawn: () => {},
    spawnSync: () => {}
  };
});

const ProcessHelper = require("../../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");
const TestExpression = require("../../../../src/cli/Interpreter/Expressions/Test");

afterEach(() => {
  jest.restoreAllMocks();
});

test("executes test command in a separate process", () => {
  const cwdSpy = jest.spyOn(ProcessHelper, "cwd");
  const spawnSyncSpy = jest.spyOn(ProcessHelper, "spawnSync");
  const context = new InterpreterContext(["$", "Boring", "test"]);
  const expression = new TestExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(cwdSpy).toHaveBeenCalled();
  expect(spawnSyncSpy).toHaveBeenCalledWith(
    `./node_modules/.bin/jest --forceExit --coverage --runInBand test`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: undefined
    }
  );
});
