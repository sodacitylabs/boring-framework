#!/usr/bin/env node

const fs = require("fs");

const [, , ...args] = process.argv;
const dir = process.cwd();
const cmd = args[0];

switch (cmd) {
  case "generate":
    generate();
    break;
  case "migrate":
    migrateDatabase();
    break;
  case "new":
    newProject();
    break;
  case "routes":
    showRoutes();
    break;
  case "server":
    startServer();
    break;
  case "test":
    runTests();
    break;
  default:
    console.error(`Unknown command ${cmd} and args phrase`);
    process.exit(1);
}

function generate() {
  try {
    if (!args[1]) {
      throw new Error("nothing to generate");
    }

    switch (args[1]) {
      case "action":
        generateAction();
        break;
      case "controller":
        generateController();
        break;
      case "migration":
        generateMigration();
        break;
      case "model":
        generateModel();
        break;
      default:
        console.error(`Unknown argument ${args[1]} for generate command`);
        process.exit(1);
    }
  } catch (ex) {
    console.error(`Error generating: ${ex.message}`);
    process.exit(1);
  }
}

function generateAction() {
  try {
    const action = args[2];
    const controller = args[3];

    require("./generate/action")(dir, controller, action);
  } catch (ex) {
    console.error(`Error creating an action: ${ex.message}`);
    process.exit(1);
  }
}

function generateController() {
  try {
    const name = args[2];

    require("./generate/controller")(dir, name);

    const actions = args.slice(3);
    actions.forEach(a => require("./generate/action")(dir, name, a));
  } catch (ex) {
    console.error(`Error creating a controller: ${ex.message}`);
    process.exit(1);
  }
}

function generateMigration() {
  try {
    const fileName = args[2];

    require("./generate/migration")(dir, fileName);
  } catch (ex) {
    console.error(`Error creating a migration: ${ex.message}`);
    process.exit(1);
  }
}

function generateModel() {
  try {
    const model = args[2];
    const attrs = args.slice(3).map(attr => {
      const pair = attr.split(":");
      return {
        name: pair[0],
        type: pair[1]
      };
    });

    require("./generate/model")(dir, model, attrs);
  } catch (ex) {
    console.error(`Error creating a model: ${ex.message}`);
    process.exit(1);
  }
}

function migrateDatabase() {
  try {
    const direction = args[1];
    const db = require(`${dir}/db`);

    if (direction === "up") {
      db.migrate
        .latest({
          directory: `${dir}/db/migrations`
        })
        .then(function() {
          console.log(`Done migrating db`);
          process.exit(0);
        });
    } else if (direction === "down") {
      db.migrate
        .rollback({
          directory: `${dir}/db/migrations`
        })
        .then(function() {
          console.log(`Done rolling back db`);
          process.exit(0);
        });
    } else {
      throw new Error(`migration direction of ${direction} is not supported.`);
    }
  } catch (ex) {
    console.error(`Error migrating db: ${ex.message}`);
    process.exit(1);
  }
}

function newProject() {
  try {
    require("./new")(args[1], dir);
  } catch (ex) {
    console.error(`Error creating new project: ${ex.message}`);
    process.exit(1);
  }
}

function showRoutes() {
  try {
    require("./routes")();
  } catch (ex) {
    console.error(`Error building routes: ${ex.message}`);
    process.exit(1);
  }
}

function startServer() {
  try {
    require("./server/start")();
  } catch (ex) {
    console.error(`Error running server: ${ex.message}`);
    process.exit(1);
  }
}

function runTests() {
  try {
    const dir = process.cwd();
    const testDirectory = `${dir}/test`;

    let tests = [];

    try {
      tests = tests.concat(
        fs
          .readdirSync(`${testDirectory}/controllers`)
          .map(f => `${testDirectory}/controllers/${f}`)
      );
    } catch (ex) {
      console.warn(`No controller tests found. Skipping.`);
    }

    try {
      tests = tests.concat(
        fs
          .readdirSync(`${testDirectory}/models`)
          .map(f => `${testDirectory}/models/${f}`)
      );
    } catch (ex) {
      console.warn(`No model tests found. Skipping.`);
    }

    require("./server/start")(async function() {
      await require("./test")(tests);

      process.exit(0);
    });
  } catch (ex) {
    console.error(`Error running tests: ${ex.message}`);
    process.exit(1);
  }
}
