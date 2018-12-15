"use strict";

const CoreConfig = require("../core/config/index.js");
const fs = require("fs");
const { spawnSync } = require("child_process");

/**
 * Create a new project at the specified directory as the root
 */
module.exports = function(name, root) {
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
          start: "./node_modules/.bin/boring start"
        },
        engines: {
          node: ">=8.11.0"
        },
        dependencies: {
          ejs: CoreConfig.versions.ejs,
          knex: CoreConfig.versions.knex,
          lodash: CoreConfig.versions.lodash,
          "@sodacitylabs/boring-framework": CoreConfig.versions.npm,
          sqlite3: CoreConfig.versions.sqlite3,
          uuid: CoreConfig.versions.uuid
        },
        devDependencies: {
          eslint: CoreConfig.versions.eslint,
          "eslint-config-prettier": "3.0.1",
          "eslint-plugin-prettier": "2.6.2",
          prettier: CoreConfig.versions.prettier
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
    `node_modules\npublic\nlog\ntmp/*\ndb/sqlite.db\n`,
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
  fs.writeFileSync(`${projectDirectory}/.nvmrc`, `v8.11.0\n`, "utf8");

  // all the application code
  console.log(`${seedingPrefix} project directories`);
  for (let i = 0; i < CoreConfig.seedDirectories.length; i++) {
    fs.mkdirSync(`${projectDirectory}/${CoreConfig.seedDirectories[i]}`);
  }

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
      routes: {
        root: "" // special route in the form controller#action
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
    const all = require("./all");
    const environment = process.env.NODE_ENV;

    let secretsConfig = {};
    let envConfig = {};

    try {
      envConfig = require(\`./\${environment}\`);
      secretsConfig = require(\`./\${environment}.secrets\`);
    } catch (e) {}
    module.exports = merge({}, all, envConfig, secretsConfig);
    `,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/all.js`,
    `module.exports = ${projectConfig};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/development.secrets.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/development.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/test.js`,
    `module.exports = {};`,
    "utf8"
  );
  fs.writeFileSync(
    `${projectDirectory}/config/production.js`,
    `module.exports = {};`,
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
