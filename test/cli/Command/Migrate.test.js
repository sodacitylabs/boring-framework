jest.mock("../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {})
  };
});

const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const MigrateExpression = require("../../../src/cli/Interpreter/Expressions/Migrate");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no direction provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "migrate"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if invalid direction provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "migrate", "sideways"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("migrates up", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  console.log = jest.fn(); // eslint-disable-line
  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/db`) {
      return {
        migrate: {
          latest: args => {
            expect(args.directory).toBe(
              `${fakeTestWorkingDirectory}/db/migrations`
            );

            return {
              then: cb => {
                cb();
              }
            };
          }
        }
      };
    }
  });

  interpretAndExecuteCommand(["$", "Boring", "migrate", "up"]);

  expect(ProcessHelper.exit).toHaveBeenCalledWith(0);
});

test("migrates down", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  console.log = jest.fn(); // eslint-disable-line
  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/db`) {
      return {
        migrate: {
          rollback: args => {
            expect(args.directory).toBe(
              `${fakeTestWorkingDirectory}/db/migrations`
            );

            return {
              then: cb => {
                cb();
              }
            };
          }
        }
      };
    }
  });

  interpretAndExecuteCommand(["$", "Boring", "migrate", "down"]);

  expect(ProcessHelper.exit).toHaveBeenCalledWith(0);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new MigrateExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
