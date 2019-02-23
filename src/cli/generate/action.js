"use strict";

const CoreConfig = require("../../core/Config");
const fs = require("fs");
const { spawnSync } = require("child_process");

const CREATING_PREFIX = `Creating  `;

/**
 * @function
 * @description adds additional action to existing controller file
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
module.exports = function(root, controller, action) {
  requireArguments(root, controller, action);
  validateArguments(root, controller, action);
  makeViewsDirectory(root, controller, action);

  const controllers = `${root}/app/controllers`;
  const views = `${root}/app/views`;
  let Controller = require(`${root}/app/controllers/${controller}.js`);

  if (
    Object.getOwnPropertyNames(Controller).filter(
      p => p.trim() === action.trim()
    ).length
  ) {
    throw new Error(
      `Action ${action} already exists for controller ${controller}.`
    );
  }

  if (action && CoreConfig.viewActionNames.indexOf(action) !== -1) {
    console.log(
      `${CREATING_PREFIX} view at ${views}/${controller}/${action}.html.ejs`
    );
    fs.writeFileSync(
      `${views}/${controller}/${action}.html.ejs`,
      `<h1>${controller}#${action}</h1>\n<p>Find me in app/views/${controller}/${action}.html.ejs</p>`,
      "utf8"
    );
  }

  console.log(`${CREATING_PREFIX} action for ${controllers}/${controller}.js`);

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

  overwriteControllerFile(
    root,
    `${root}/app/controllers/${controller}.js`,
    Controller,
    fileContents
  );
};

/**
 * @function makeViewsDirectory
 * @private
 * @description if view action and first view action for controller, create views subdirectory
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function makeViewsDirectory(root, controller, action) {
  if (
    CoreConfig.viewActionNames.indexOf(action) !== -1 &&
    !fs.existsSync(`${root}/app/views/${controller}`)
  ) {
    console.log(
      `${CREATING_PREFIX} views folder at ${root}/app/views/${controller}`
    );
    fs.mkdirSync(`${root}/app/views/${controller}`);
  }
}

/**
 * @function overwriteControllerFile
 * @private
 * @description overwrite existing controller class' contents with new contents
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} filePath - filePath to the controller
 * @param {class} controller - the required controller class
 * @param {string} contents - contents of the controller class to recreate
 *
 * @returns {null}
 */
function overwriteControllerFile(root, filePath, controller, contents) {
  let controllerFile = fs.readFileSync(filePath).toString();

  fs.writeFileSync(
    filePath,
    controllerFile.replace(
      /(class (\w*)Controller)([\s\w]*)({(\s*))([\w\n\s\t();,{}!#./*@$:=`[\]"|'&_?]*)(};)/g,
      `class ${controller.name} extends RequestController {
        ${contents}
      };`
    ),
    "utf8"
  );

  spawnSync(`${root}/node_modules/.bin/prettier "${filePath}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: root
  });
}

/**
 * @function requireArguments
 * @private
 * @description check if all values provided and are valid values
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function requireArguments(root, controller, action) {
  if (!controller) {
    throw new Error(
      `Generating an action for a controller requires a controller name`
    );
  }

  if (!action) {
    throw new Error(
      `Generating an action for a controller requires an action name`
    );
  }
}

/**
 * @function validateArguments
 * @private
 * @description check if all values are semantically valid
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function validateArguments(root, controller, action) {
  if (CoreConfig.actionNames.indexOf(action) === -1) {
    throw new Error(`Action ${action} is not a valid action name.`);
  }

  if (!fs.existsSync(`${root}/app/controllers/${controller}.js`)) {
    throw new Error(`Controller ${controller} does not exist.`);
  }
}
