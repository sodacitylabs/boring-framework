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

  const controllers = `${root}/app/controllers`;
  const Controller = require(`${root}/app/controllers/${controller}.js`);

  preventDuplicateAction(Controller, action);
  makeViewsDirectory(root, controller, action);
  writeViewTemplate(root, controller, action);

  const fileContents = buildClassContents(Controller, action);

  overwriteControllerFile(
    root,
    `${controllers}/${controller}.js`,
    Controller,
    fileContents
  );
};

/**
 * @function buildClassContents
 * @private
 * @description accumulates all the class functions and contents
 *
 * @param {class} controller - required controller module
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function buildClassContents(controller, action) {
  let fileContents = "";

  // todo: should maintain the functions in abc order and write file contents for
  // new action inside the foreach for better diffs

  // todo: maybe simplify this block a bit
  let properties = Object.getOwnPropertyNames(controller);
  properties.push(`${action}`);
  properties = properties.sort((a, b) => a[0].localeCompare(b[0]));
  properties.forEach(p => {
    if (p === action) {
      if (CoreConfig.viewActionNames.indexOf(action) === -1) {
        fileContents += `static async ${action}(req, res) { try { res.send(204); } catch(ex) { res.send(500); } }\n`;
      } else if (CoreConfig.viewActionNames.indexOf(action) !== -1) {
        fileContents += `static async ${action}(req, res) { try { res.render(); } catch(ex) { res.send(500); } }\n`;
      }
    } else if (CoreConfig.actionNames.indexOf(p) !== -1) {
      const descriptor = Object.getOwnPropertyDescriptor(controller, p);

      fileContents += "static " + descriptor.value.toString() + "\n";
    }
  });

  // todo: verify that the new file's contents length are as expected

  return fileContents;
}

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
 * @function preventDuplicateAction
 * @private
 * @description prevents trying to add the same action more than once
 *
 * @param {class} controller - required controller module
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function preventDuplicateAction(controller, action) {
  if (
    Object.getOwnPropertyNames(controller).filter(
      p => p.trim() === action.trim()
    ).length
  ) {
    throw new Error(
      `Action ${action} already exists for controller ${controller}.`
    );
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
      /(class (\w*)Controller)([\s\w]*)({(\s*))([\w\n\s\t();,{}!#./*@$:=`[\]"|'&_?-]*)(};)/g,
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
 * @throws {Error}
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
 * @throws {Error}
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

/**
 * @function writeViewTemplate
 * @private
 * @description creates basic view template if action is a view action
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function writeViewTemplate(root, controller, action) {
  const views = `${root}/app/views`;

  if (CoreConfig.viewActionNames.indexOf(action) !== -1) {
    console.log(
      `${CREATING_PREFIX} view at ${views}/${controller}/${action}.html.ejs`
    );
    fs.writeFileSync(
      `${views}/${controller}/${action}.html.ejs`,
      `<h1>${controller}#${action}</h1>\n<p>Find me in app/views/${controller}/${action}.html.ejs</p>`,
      "utf8"
    );
  }
}
