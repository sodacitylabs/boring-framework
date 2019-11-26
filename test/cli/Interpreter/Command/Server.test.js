jest.mock("../../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {}),
    spawn: jest.fn().mockImplementation(() => {}),
    spawnSync: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("../../../../src/core/RouterV2", () => {
  function MockRouter() {}

  MockRouter.prototype.load = jest.fn().mockImplementation(() => {});

  return MockRouter;
});

jest.mock("fastify", () => {
  function MockFastify() {}

  MockFastify.prototype.listen = jest.fn().mockImplementation(() => {});
  MockFastify.prototype.register = jest.fn().mockImplementation(() => {});
  MockFastify.prototype.route = jest.fn().mockImplementation(() => {});
  MockFastify.prototype.log = {
    info: jest.fn().mockImplementation(() => {}),
    error: jest.fn().mockImplementation(() => {})
  };

  return MockFastify;
});

jest.mock("fastify-static", () => {
  return jest.fn();
});

const ProcessHelper = require("../../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../../src/cli/Interpreter/InterpreterContext");
const ServerExpression = require("../../../../src/cli/Interpreter/Expressions/Server");
const Router = require("../../../../src/core/RouterV2");
const Fastify = require("fastify");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("executes server command in a separate process w/o reload option", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        server: {
          port: 1776
        }
      };
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => []);

  const cwdSpy = jest.spyOn(ProcessHelper, "cwd");
  const requireSpy = jest.spyOn(ProcessHelper, "require");
  const spawnSyncSpy = jest.spyOn(ProcessHelper, "spawnSync");

  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(cwdSpy).toHaveBeenCalled();
  expect(requireSpy).toHaveBeenCalledWith(`${fakeTestWorkingDirectory}/config`);
  expect(spawnSyncSpy).toHaveBeenCalledTimes(3);
});

test("uses nodemon to reload if --reload arg given", () => {
  /* eslint-disable-next-line no-inner-declarations */
  function MockNodemon() {
    return MockNodemon;
  }
  MockNodemon.on = function() {
    return MockNodemon;
  };

  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        server: {
          port: 1776
        }
      };
    } else if (path === `${fakeTestWorkingDirectory}/node_modules/nodemon`) {
      return MockNodemon;
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  const onSpy = jest.spyOn(MockNodemon, "on");

  const context = new InterpreterContext(["$", "Boring", "server", "--reload"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(onSpy).toHaveBeenCalledTimes(3);
});

test("tries to start maildev if default config", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        mailer: {
          default: {}
        },
        server: {
          port: 1776
        }
      };
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => []);

  const spawnSpy = jest.spyOn(ProcessHelper, "spawn");

  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(spawnSpy).toHaveBeenCalledTimes(1);
  expect(spawnSpy).toHaveBeenCalledWith(`./node_modules/.bin/maildev`, {
    cwd: fakeTestWorkingDirectory,
    shell: true,
    stdio: "inherit"
  });
});

test("tries to mount any routes returned", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";
  const fakeRoute = {
    url: "/fake-route"
  };

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        server: {
          port: 1776
        }
      };
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => [fakeRoute]);

  const routeSpy = jest.spyOn(Fastify.prototype, "route");
  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(routeSpy).toHaveBeenCalledTimes(1);
  expect(routeSpy).toHaveBeenCalledWith(fakeRoute);
});

test("tries to listen on the configured port", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        server: {
          port: 1776
        }
      };
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Fastify.prototype.listen.mockImplementation((config, callback) => {
    expect(config.port).toBe(1776);

    callback();
  });
  Router.prototype.load.mockImplementation(() => []);

  const listenSpy = jest.spyOn(Fastify.prototype, "listen");
  const logSpy = jest.spyOn(Fastify.prototype.log, "info");
  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(listenSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).toHaveBeenCalledTimes(1);
});

test("exits if fastify is unable to listen", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      return {
        server: {
          port: 1776
        }
      };
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Fastify.prototype.listen.mockImplementation((config, callback) => {
    callback(new Error("Just a fake error"));
  });
  Router.prototype.load.mockImplementation(() => []);

  const listenSpy = jest.spyOn(Fastify.prototype, "listen");
  const logSpy = jest.spyOn(Fastify.prototype.log, "error");
  const exitSpy = jest.spyOn(ProcessHelper, "exit");
  const context = new InterpreterContext(["$", "Boring", "server"]);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);

  expect(listenSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).toHaveBeenCalledTimes(1);
  expect(exitSpy).toHaveBeenCalledTimes(1);
});
