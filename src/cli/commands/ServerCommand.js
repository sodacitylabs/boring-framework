const Command = require("./Command");

module.exports = class ServerCommand extends Command {
  execute(context) {
    const { spawn, spawnSync } = require("child_process");
    const dir = process.cwd();
    const projectConfig = require(`${dir}/config`);
    const inputs = context.getInput();
    const reload = inputs[1] && inputs[1] === "--reload";

    if (reload) {
      const nodemon = require(`${dir}/node_modules/nodemon`);

      nodemon({});

      nodemon
        .on("start", function() {
          console.log("Server has started");
        })
        .on("quit", function() {
          console.log("Server has quit");
          process.exit();
        })
        .on("restart", function(files) {
          console.log("Server restarted due to: ", files);
        });
    } else {
      const path = require("path");
      const Router = require("../core/RouterV2");
      const fastify = require("fastify")({ logger: true });
      const port = projectConfig.server.port || 3000;
      const start = Date.now();
      const router = new Router(projectConfig, dir);
      const routes = router.load();

      if (projectConfig.mailer.default) {
        spawn(`./node_modules/.bin/maildev`, {
          stdio: `inherit`,
          shell: true,
          cwd: dir
        });
      }

      routes.forEach(r => {
        fastify.route(r);
      });

      fastify.register(require("fastify-static"), {
        root: path.join(dir, "public")
      });

      spawnSync(`cp -R app/assets/images/. public/assets/images`, {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      });

      spawnSync("kill -9 $(lsof -i tcp:1025) 2> /dev/null", {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      });

      spawnSync("kill -9 $(lsof -i tcp:1080) 2> /dev/null", {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      });

      fastify.listen({ port }, err => {
        if (err) {
          fastify.log.error(`server failed to start from ${err.message}`);

          return process.exit(1);
        }

        fastify.log.info(
          `server listening on port ${port}. Startup took ${Date.now() -
            start}ms`
        );
      });
    }
  }
};
