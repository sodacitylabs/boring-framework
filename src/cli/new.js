"use strict";

const CoreConfig = require("../core/Config");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

/**
 * Create a new project at the specified directory as the root
 */
module.exports = function(name, root) {
  const nodeVersion = fs
    .readFileSync(path.resolve(__dirname, "../../.nvmrc"))
    .toString();
  const boringPkg = require("../../package.json");
  const projectDirectory = `${root}/${name}`;
  const creatingPrefix = `Creating  `;
  const installPrefix = `Installing`;
  const seedingPrefix = `Seeding   `;

  if (!name) {
    throw new Error(`Running the new command requires a project name`);
  } else if (fs.existsSync(projectDirectory)) {
    throw new Error(
      `Unable to create directory ${projectDirectory} because it already exists`
    );
  }

  // TODO: introduce artificial delays between steps with better messaging / colors
  //       to describe whats happening and why

  // root project
  console.log(`${creatingPrefix} project root at ${projectDirectory}`);
  fs.mkdirSync(projectDirectory);

  // todo: create a package-lock.json / shrinkwrap for the project
  console.log(`${creatingPrefix} package.json`);
  fs.writeFileSync(
    `${projectDirectory}/package.json`,
    JSON.stringify(
      {
        name: name,
        scripts: {
          lint: "./node_modules/.bin/eslint --color app config test",
          start: "./node_modules/.bin/boring server",
          test: "./node_modules/.bin/boring test"
        },
        engines: {
          node: boringPkg.engines.node
        },
        nodemonConfig: {
          watch: ["config/", "app/"],
          ignore: ["app/assets/"],
          ext: "js json ejs"
        },
        dependencies: {
          "@sodacitylabs/boring-framework": boringPkg.version,
          ejs: "2.6.1",
          fastify: "2.10.0",
          "fastify-static": "2.5.0",
          knex: "0.19.1",
          lodash: "4.17.15",
          nodemon: "1.18.9",
          sqlite3: "4.0.9"
        },
        devDependencies: {
          eslint: "6.1.0",
          "eslint-config-prettier": "6.0.0",
          "eslint-plugin-prettier": "3.1.0",
          "eslint-plugin-jest": "22.3.0",
          jest: "24.9.0",
          prettier: "1.18.2"
        },
        jest: {
          testEnvironment: "jsdom",
          testURL: "http://localhost",
          bail: false,
          verbose: true,
          testMatch: ["<rootDir>/test/**/*.test.js"],
          moduleNameMapper: {
            "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
              "<rootDir>/test/setup/fileMock.js",
            "\\.(css|less)$": "<rootDir>/test/setup/styleMock.js"
          },
          moduleFileExtensions: ["js"],
          moduleDirectories: ["node_modules"],
          collectCoverage: true,
          coverageDirectory: "<rootDir>/coverage",
          collectCoverageFrom: ["app/{controllers,models}/**/*.js*"],
          coverageReporters: ["html", "text", "text-summary"],
          coverageThreshold: {
            global: {
              branches: 85,
              functions: 85,
              lines: 85
            }
          },
          setupFiles: ["<rootDir>/test/setup/fastify.js"]
        }
      },
      null,
      2
    ),
    "utf8"
  );

  // gitignore for files we dont want checked into source control
  console.log(`${creatingPrefix} .gitignore`);
  fs.writeFileSync(
    `${projectDirectory}/.gitignore`,
    `node_modules\npublic\n!public/robots.txt\nlog\ntmp/*\ndb/sqlite.db\ncoverage\n`,
    "utf8"
  );

  // todo: fill in this content
  console.log(`${creatingPrefix} README.md`);
  fs.writeFileSync(
    `${projectDirectory}/README.md`,
    `#${name}\nDocument whatever steps are necessary to get the
  run, build, test and deploy your app.`,
    "utf8"
  );

  console.log(`${creatingPrefix} .npmrc`);
  fs.writeFileSync(`${projectDirectory}/.npmrc`, `save_exact=true\n`, "utf8");

  console.log(`${creatingPrefix} .nvmrc`);
  fs.writeFileSync(`${projectDirectory}/.nvmrc`, `${nodeVersion}`, "utf8");

  // all the application code
  console.log(`${seedingPrefix} project directories`);
  for (let i = 0; i < CoreConfig.seedDirectories.length; i++) {
    fs.mkdirSync(`${projectDirectory}/${CoreConfig.seedDirectories[i]}`);
  }

  // robots.txt
  console.log(`${creatingPrefix} robots.txt`);
  fs.writeFileSync(
    `${projectDirectory}/public/robots.txt`,
    "User-agent: *\nAllow: /\n",
    "utf8"
  );

  // base config.js file
  console.log(`${creatingPrefix} base config for project`);
  const projectConfig = JSON.stringify(
    {
      db: {
        client: "sqlite3",
        connection: {
          filename: "./db/sqlite.db"
        },
        useNullAsDefault: true
      },
      mailer: {
        default: true,
        plugin: "smtp",
        transport: {
          host: "0.0.0.0",
          port: 1025,
          ignoreTLS: true
        }
      },
      server: {
        port: 3000
      }
    },
    null,
    2
  );
  fs.writeFileSync(
    `${projectDirectory}/config/index.js`,
    `
    "use strict";

    const merge = require("lodash/merge");
    const all = require("./environments/all");
    const environment = process.env.NODE_ENV;

    let secretsConfig = {};
    let envConfig = {};

    try {
      envConfig = require(\`./environments/\${environment}\`);
      secretsConfig = require(\`./environments/\${environment}.secrets\`);
    } catch (e) {}
    module.exports = merge({}, all, envConfig, secretsConfig);
    `,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/environments/all.js`,
    `module.exports = ${projectConfig};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/environments/development.secrets.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/environments/development.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/environments/test.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/environments/production.js`,
    `module.exports = {};`,
    "utf8"
  );

  // base routes.js file
  console.log(`${creatingPrefix} base routes for project`);
  fs.writeFileSync(
    `${projectDirectory}/config/routes.js`,
    `
    "use strict";

    module.exports = function(get, post, put, del) { // eslint-disable-line no-unused-vars
      // Using these functions, register routes i.e. get("/", "ControllerName#action")
    };
    `,
    "utf8"
  );

  // editor config
  console.log(`${creatingPrefix} .editorconfig`);
  fs.writeFileSync(
    `${projectDirectory}/.editorconfig`,
    CoreConfig.templates.editorConfig,
    "utf8"
  );

  // eslint for node server
  console.log(`${creatingPrefix} .eslintrc.json`);
  fs.writeFileSync(
    `${projectDirectory}/.eslintrc.json`,
    JSON.stringify(
      {
        env: {
          es6: true,
          node: true
        },
        parserOptions: {
          ecmaVersion: 2017
        },
        extends: ["eslint:recommended"],
        rules: {
          "no-console": ["warn"],
          "no-empty": [
            "error",
            {
              allowEmptyCatch: true
            }
          ]
        }
      },
      null,
      2
    ),
    "utf8"
  );
  // eslint files to ignore
  console.log(`${creatingPrefix} .eslintignore`);
  fs.writeFileSync(
    `${projectDirectory}/.eslintignore`,
    `node_modules\npackage.json\napp/assets\ntmp\npublic\nlogs\nsqlite.db`,
    "utf8"
  );
  // prettier files to ignore
  console.log(`${creatingPrefix} .prettierignore`);
  fs.writeFileSync(
    `${projectDirectory}/.prettierignore`,
    `node_modules\npackage.json\napp/assets\ntmp\npublic\nlogs\nsqlite.db`,
    "utf8"
  );

  // eslint for tests
  console.log(`${creatingPrefix}/test .eslintrc.json`);
  fs.writeFileSync(
    `${projectDirectory}/test/.eslintrc.json`,
    JSON.stringify(
      {
        env: {
          es6: true,
          node: true,
          "jest/globals": true
        },
        parserOptions: {
          ecmaVersion: 2017
        },
        extends: [
          "eslint:recommended",
          "plugin:jest/recommended",
          "plugin:jest/style"
        ],
        rules: {
          "no-console": ["warn"],
          "no-empty": [
            "error",
            {
              allowEmptyCatch: true
            }
          ]
        }
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`${creatingPrefix} jest test setups`);
  fs.mkdirSync(`${projectDirectory}/test/setup`);
  fs.writeFileSync(
    `${projectDirectory}/test/setup/styleMock.js`,
    `module.exports = {};\n`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/test/setup/fileMock.js`,
    `module.exports = 'test-file-stub';\n`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/test/setup/fastify.js`,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const Router = Boring.Router;
    const path = require('path');
    const Fastify = require('fastify');

    const rootDirectory = path.resolve(__dirname + '/../../');
    const router = new Router(require(rootDirectory + '/config'), rootDirectory);
    const routes = router.load();
    const fastify = new Fastify({ logger: false });

    routes.forEach(r => {
      fastify.route(r);
    });

    global.fastify = fastify;
    `,
    "utf8"
  );

  // empty sqlite db. default for new projects.
  console.log(`${creatingPrefix} sqlite development database`);
  fs.writeFileSync(`${projectDirectory}/db/sqlite.db`, ``, "utf8");

  // default connection to db that ActiveRecord will use
  console.log(`${creatingPrefix} default database connection`);
  fs.writeFileSync(
    `${projectDirectory}/db/index.js`,
    `
    const config = require('../config');
    const knex = require('knex')(config.db);

    module.exports = knex;
    `,
    "utf8"
  );

  // todo: set executable permissons on boring.sh
  console.log(`${creatingPrefix} bin folder`);
  fs.writeFileSync(
    `${projectDirectory}/bin/boring.sh`,
    "#!/bin/bash\n" +
      "array=( $@ )\n" +
      "len=${#array[@]}\n" +
      "_args=${array[@]:0:$len}\n\n" +
      "./node_modules/.bin/boring $_args",
    "utf8"
  );

  console.log(`NVM installing`);
  spawnSync(`nvm install ${nodeVersion}`, {
    stdio: `inherit`,
    cwd: projectDirectory
  });

  console.log(`NVM using`);
  spawnSync(`nvm use`, {
    stdio: `inherit`,
    cwd: projectDirectory
  });

  console.log(`${installPrefix} project dependencies`);
  spawnSync(`npm install`, {
    stdio: `inherit`,
    shell: true,
    cwd: projectDirectory
  });

  spawnSync(
    `${projectDirectory}/node_modules/.bin/prettier "${projectDirectory}/config/**/*.js" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: root
    }
  );
  spawnSync(
    `${projectDirectory}/node_modules/.bin/prettier "${projectDirectory}/db/**/*.js" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: root
    }
  );
};
