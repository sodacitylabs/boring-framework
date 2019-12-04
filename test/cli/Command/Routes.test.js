jest.mock("../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("../../../src/core/RouterV2", () => {
  function MockRouter() {}

  MockRouter.prototype.load = jest.fn().mockImplementation(() => {});

  return MockRouter;
});

const Router = require("../../../src/core/RouterV2");
// const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const RoutesExpression = require("../../../src/cli/Interpreter/Expressions/Routes");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no config folder found", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "routes"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("prints empty header to the console if no routes", () => {
  console.log = jest.fn(); // eslint-disable-line
  Router.prototype.load.mockImplementation(() => []);

  interpretAndExecuteCommand(["$", "Boring", "routes"]);

  expect(Router.prototype.load).toHaveBeenCalled();
  expect(console.log.mock.calls).toHaveLength(1); // eslint-disable-line
});

test("prints routes to the console if no routes", () => {
  console.log = jest.fn(); // eslint-disable-line
  Router.prototype.load.mockImplementation(() => [
    {
      method: "GET",
      url: "/",
      controller: "Fake",
      action: "index"
    }
  ]);

  interpretAndExecuteCommand(["$", "Boring", "routes"]);

  expect(Router.prototype.load).toHaveBeenCalled();
  expect(console.log.mock.calls).toHaveLength(2); // eslint-disable-line

  const loggedRoute = console.log.mock.calls[1][0];

  expect(loggedRoute.indexOf("GET")).toBeGreaterThan(-1);
  expect(loggedRoute.indexOf("/")).toBeGreaterThan(-1);
  expect(loggedRoute.indexOf("Fake#index")).toBeGreaterThan(-1);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new RoutesExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
