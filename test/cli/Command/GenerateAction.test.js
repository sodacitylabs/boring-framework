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
const GenerateActionExpression = require("../../../src/cli/Interpreter/Expressions/GenerateAction");
const fs = require("fs");
// const child_process = require("child_process");

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("throws if no action provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "action"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if invalid action provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "action", "help"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if no controller provided", () => {
  try {
    interpretAndExecuteCommand(["$", "Boring", "generate", "action", "index"]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if no controller found", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => {
    return false;
  });

  try {
    interpretAndExecuteCommand([
      "$",
      "Boring",
      "generate",
      "action",
      "index",
      "Fake"
    ]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if action already exists", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => true);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return class FakeController {
        static async index() {}
      };
    }
  });

  try {
    interpretAndExecuteCommand([
      "$",
      "Boring",
      "generate",
      "action",
      "index",
      "Fake"
    ]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("throws if invalid regex for controller file", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(() => true);
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return class Fake {};
    }
  });

  try {
    interpretAndExecuteCommand([
      "$",
      "Boring",
      "generate",
      "action",
      "index",
      "Fake"
    ]);

    throw new Error("should throw");
  } catch (ignore) {}
});

test("attempts to create a view-based action", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  console.log = jest.fn(); // eslint-disable-line
  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return true;
    } else if (
      path === `${fakeTestWorkingDirectory}/app/views/Fake/index.html.ejs`
    ) {
      return false;
    } else if (path === `${fakeTestWorkingDirectory}/app/views/Fake`) {
      return false;
    }
  });
  fs.readFileSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return `class FakeController extends RequestController {};`;
    }
  });
  fs.mkdirSync.mockImplementation(path => {
    if (path !== `${fakeTestWorkingDirectory}/app/views/Fake`) {
      throw new Error("shouldnt have been called");
    }
  });
  fs.writeFileSync.mockImplementation((path, contents) => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      expect(contents.indexOf("static async index")).toBeGreaterThan(0);
      expect(contents.indexOf("res.render()")).toBeGreaterThan(0);
    }

    if (path === `${fakeTestWorkingDirectory}/app/views/Fake/index.html.ejs`) {
      expect(
        contents.indexOf("<p>Find me in app/views/Fake/index.html.ejs</p>")
      ).toBeGreaterThan(0);
    }
  });
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return class FakeController {};
    }
  });

  interpretAndExecuteCommand([
    "$",
    "Boring",
    "generate",
    "action",
    "index",
    "Fake"
  ]);

  expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
});

test("attempts to create a non view-based action", () => {
  const fakeTestWorkingDirectory = "/fake/directory/that/doesnt/exist";

  console.log = jest.fn(); // eslint-disable-line
  ProcessHelper.cwd.mockImplementation(() => fakeTestWorkingDirectory);
  fs.existsSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return true;
    } else if (
      path === `${fakeTestWorkingDirectory}/app/views/Fake/index.html.ejs`
    ) {
      throw new Error(`shouldnt have been called`);
    }
  });
  fs.readFileSync.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return `class FakeController extends RequestController {};`;
    }
  });
  fs.writeFileSync.mockImplementation((path, contents) => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      expect(contents.indexOf("static async update")).toBeGreaterThan(0);
      expect(contents.indexOf("res.code(204).send")).toBeGreaterThan(0);
    }

    if (path === `${fakeTestWorkingDirectory}/app/views/Fake/index.html.ejs`) {
      throw new Error(`shouldnt have been called`);
    }
  });
  ProcessHelper.require.mockImplementation(path => {
    if (path === `${fakeTestWorkingDirectory}/app/controllers/Fake.js`) {
      return class FakeController {};
    }
  });

  interpretAndExecuteCommand([
    "$",
    "Boring",
    "generate",
    "action",
    "update",
    "Fake"
  ]);

  expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
});

function interpretAndExecuteCommand(args) {
  const context = new InterpreterContext(args);
  const expression = new GenerateActionExpression();

  expression.interpret(context);

  const command = context.getOutput();

  command.execute(context);
}
