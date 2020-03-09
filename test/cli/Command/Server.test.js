jest.mock("../../../src/core/helpers/ProcessHelper", () => {
  return {
    cwd: jest.fn().mockImplementation(() => {}),
    exit: jest.fn().mockImplementation(() => {}),
    require: jest.fn().mockImplementation(() => {}),
    kill: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("child_process", () => {
  return {
    spawn: jest.fn().mockImplementation(() => {}),
    spawnSync: jest.fn().mockImplementation(() => {})
  };
});

jest.mock("../../../src/core/RouterV2", () => {
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

const ProcessHelper = require("../../../src/core/helpers/ProcessHelper");
const InterpreterContext = require("../../../src/cli/Interpreter/InterpreterContext");
const ServerExpression = require("../../../src/cli/Interpreter/Expressions/Server");
const Router = require("../../../src/core/RouterV2");
const Fastify = require("fastify");
const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("executes server command in a separate process w/o reload option", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      class FakeConfig {
        constructor() {
          this.config = {
            server: {
              port: 1776
            }
          };
        }

        get(key) {
          return require("lodash").get(this.config, key);
        }
      }

      return new FakeConfig();
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => []);

  interpretAndExecuteCommand(["$", "Boring", "server"]);

  expect(ProcessHelper.cwd).toHaveBeenCalled();
  expect(ProcessHelper.require).toHaveBeenCalledWith(
    `${fakeTestWorkingDirectory}/config`
  );
  expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
  expect(ProcessHelper.kill).toHaveBeenCalledTimes(2);
});

test("tries to start maildev if default config", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      class FakeConfig {
        constructor() {
          this.config = {
            mailer: {
              default: {}
            },
            server: {
              port: 1776
            }
          };
        }

        get(key) {
          return require("lodash").get(this.config, key);
        }
      }

      return new FakeConfig();
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => []);

  interpretAndExecuteCommand(["$", "Boring", "server"]);

  expect(child_process.spawn).toHaveBeenCalledTimes(1);
  expect(child_process.spawn).toHaveBeenCalledWith(
    `./node_modules/.bin/maildev`,
    {
      cwd: fakeTestWorkingDirectory,
      shell: true,
      stdio: "inherit"
    }
  );
});

test("tries to mount any routes returned", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";
  const fakeRoute = {
    url: "/fake-route"
  };

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      class FakeConfig {
        constructor() {
          this.config = {
            server: {
              port: 1776
            }
          };
        }

        get(key) {
          return require("lodash").get(this.config, key);
        }
      }

      return new FakeConfig();
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Router.prototype.load.mockImplementation(() => [fakeRoute]);

  interpretAndExecuteCommand(["$", "Boring", "server"]);

  expect(Fastify.prototype.route).toHaveBeenCalledTimes(1);
  expect(Fastify.prototype.route).toHaveBeenCalledWith(fakeRoute);
});

test("tries to listen on the configured port", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      class FakeConfig {
        constructor() {
          this.config = {
            server: {
              port: 1776
            }
          };
        }

        get(key) {
          return require("lodash").get(this.config, key);
        }
      }

      return new FakeConfig();
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Fastify.prototype.listen.mockImplementation((config, callback) => {
    expect(config.port).toBe(1776);

    callback();
  });
  Router.prototype.load.mockImplementation(() => []);

  interpretAndExecuteCommand(["$", "Boring", "server"]);

  expect(Fastify.prototype.listen).toHaveBeenCalledTimes(1);
  expect(Fastify.prototype.log.info).toHaveBeenCalledTimes(1);
});

test("exits if fastify is unable to listen", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/config`) {
      class FakeConfig {
        constructor() {
          this.config = {
            server: {
              port: 1776
            }
          };
        }

        get(key) {
          return require("lodash").get(this.config, key);
        }
      }

      return new FakeConfig();
    }

    throw new Error(`Unforeseen require call for ${path}`);
  });

  Fastify.prototype.listen.mockImplementation((config, callback) => {
    callback(new Error("Just a fake error"));
  });
  Router.prototype.load.mockImplementation(() => []);

  interpretAndExecuteCommand(["$", "Boring", "server"]);

  expect(Fastify.prototype.listen).toHaveBeenCalledTimes(1);
  expect(Fastify.prototype.log.error).toHaveBeenCalledTimes(1);
  expect(ProcessHelper.exit).toHaveBeenCalledTimes(1);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new ServerExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
