"use strict";

const CoreConfig = require("../../config");
const fs = require("fs");
const { spawnSync } = require("child_process");

/**
 * Create an action on an already existing controller
 */
module.exports = function(root, name, action) {
  const creatingPrefix = `Creating  `;

  if (!name) {
    throw new Error(
      `Generating an action for a controller requires a controller name`
    );
  }

  if (!action) {
    throw new Error(
      `Generating an action for a controller requires an action name`
    );
  }

  if (CoreConfig.actionNames.indexOf(action) === -1) {
    throw new Error(`Action ${action} is not a valid action name.`);
  }

  if (name[0] !== name[0].toUpperCase()) {
    name[0] = name[0].toUpperCase();
  }

  action = action.toLowerCase();

  if (!fs.existsSync(`${root}/app/controllers/${name}.js`)) {
    throw new Error(`Controller ${name} does not exist.`);
  }

  if (
    CoreConfig.viewActionNames.indexOf(action) !== -1 &&
    !fs.existsSync(`${root}/app/views/${name}`)
  ) {
    console.log(`${creatingPrefix} views folder at ${root}/app/views/${name}`);
    fs.mkdirSync(`${root}/app/views/${name}`);
  }

  let Controller = require(`${root}/app/controllers/${name}.js`);
  let controllerFile = fs
    .readFileSync(`${root}/app/controllers/${name}.js`)
    .toString();

  if (
    Object.getOwnPropertyNames(Controller).filter(
      p => p.trim() === action.trim()
    ).length
  ) {
    throw new Error(`Action ${action} already exists for controller ${name}.`);
  }

  const controllers = `${root}/app/controllers`;
  const views = `${root}/app/views`;

  if (action && CoreConfig.viewActionNames.indexOf(action) !== -1) {
    console.log(
      `${creatingPrefix} view at ${views}/${name}/${action}.html.ejs`
    );
    fs.writeFileSync(
      `${views}/${name}/${action}.html.ejs`,
      `<h1>${name}#${action}</h1>\n<p>Find me in app/views/${name}/${action}.html.ejs</p>`,
      "utf8"
    );
  }

  console.log(`${creatingPrefix} action for ${controllers}/${name}.js`);

  let fileContents = "";

  // todo: should maintain the functions in abc order and write file contents for
  // new action inside the foreach for better diffs

  let properties = Object.getOwnPropertyNames(Controller);
  properties.push(`${action}`);
  properties = properties.sort((a, b) => a[0].localeCompare(b[0]));
  properties.forEach(p => {
    if (p === action) {
      if (CoreConfig.viewActionNames.indexOf(action) === -1) {
        fileContents += `static async ${action}(req, res) { res.send(204); }\n`;
      } else if (CoreConfig.viewActionNames.indexOf(action) !== -1) {
        fileContents += `static async ${action}(req, res) { res.render(); }\n`;
      }
    } else if (CoreConfig.actionNames.indexOf(p) !== -1) {
      const descriptor = Object.getOwnPropertyDescriptor(Controller, p);

      fileContents += "static " + descriptor.value.toString() + "\n";
    }
  });

  // todo: verify that the new file's contents length are as expected

  fs.writeFileSync(
    `${root}/app/controllers/${name}.js`,
    controllerFile.replace(
      /(class (\w*)Controller)(\s*)({(\s*))([\w\n\s\t();,{}./*@$:=`[\]"]*)(};)/g,
      `class ${Controller.name} {
        ${fileContents}
      };`
    ),
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
};
