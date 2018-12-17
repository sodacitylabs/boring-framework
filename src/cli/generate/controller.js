"use strict";

const fs = require("fs");
const { spawnSync } = require("child_process");

/**
 * Create an empty controller
 */
module.exports = function(root, name) {
  const creatingPrefix = `Creating  `;

  // todo: normalize these better for multi-word, plurals etc.

  if (!name) {
    throw new Error(`Generating a controller requires a controller name`);
  }

  if (name[0] !== name[0].toUpperCase()) {
    name[0] = name[0].toUpperCase();
  }

  // todo: get all file names and check for non-normalize and normalized versions
  if (name && fs.existsSync(`${root}/app/controllers/${name}.js`)) {
    throw new Error(
      `Controller ${name} already exists. Did you mean to create an action instead?`
    );
  }

  console.log(
    `${creatingPrefix} controller at ${root}/app/controllers/${name}.js`
  );

  fs.writeFileSync(
    `${root}/app/controllers/${name}.js`,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const RequestController = Boring.Controller.RequestController;

    module.exports = class ${name}Controller extends RequestController {};
    `,
    "utf8"
  );

  const testFile = `${root}/test/controllers/${name}ControllerTest.js`;

  fs.writeFileSync(
    testFile,
    `
    const Boring = require('@sodacitylabs/boring-framework');
    const IntegrationTest = Boring.Test.IntegrationTest;

    module.exports = class ${name}ControllerTest extends IntegrationTest {
      constructor(attrs) {
        super(attrs);
      }
      // async "returns true"() {
      //   return true;
      // }
      // async "fails"() {
      //   throw new Error("test failed");
      // }
    };
    `,
    "utf8"
  );

  spawnSync(
    `${root}/node_modules/.bin/prettier "${root}/app/controllers/${name}.js" --write`,
    {
      stdio: `inherit`,
      shell: true,
      cwd: root
    }
  );
  spawnSync(`${root}/node_modules/.bin/prettier "${testFile}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: root
  });
};