const Command = require("./Command");
const Router = require("../../core/RouterV2");

module.exports = class RoutesCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    const dir = process.cwd();
    const projectConfig = require(`${dir}/config`);
    const headers = ["Verb", "URI Pattern", "Controller#Action"];
    const router = new Router(projectConfig, dir);

    let routes = router.load();
    let maxURILength = routes.reduce((acc, curr) => {
      if (curr.url.length > acc.length) {
        acc = curr.url;
      }

      return acc;
    }, "").length;
    let maxActionLength = 10;

    console.log(
      `${headers[0].padEnd(8, " ")}${headers[1].padEnd(
        Math.max(25, maxURILength + 5),
        " "
      )}${headers[2].padEnd(Math.max(25, maxActionLength + 5), " ")}`
    );

    routes.forEach(r => {
      const verb = r.method.padEnd(8, " ");
      const url = r.url.padEnd(Math.max(25, maxURILength + 5), " ");
      const controllerAndAction = `${r.controller}#${r.action}`;

      console.log(
        `${verb}${url}${controllerAndAction.padEnd(
          Math.max(25, maxActionLength + 5),
          " "
        )}`
      );
    });
  }
};
