"use strict";

const http = require("http");
const Router = require("../../core/RouterV2");
const { spawnSync } = require("child_process");

module.exports = function(cb) {
  const dir = process.cwd();
  const config = require(`${dir}/config`);
  const port = config.server.port || 3000;
  const start = Date.now();
  const router = new Router(config, dir);
  const instance = http.createServer(router.incoming);

  router.load();

  spawnSync(`cp -R app/assets/images/. public/assets/images`, {
    stdio: `inherit`,
    shell: true,
    cwd: dir
  });

  instance.listen({ port }, () => {
    console.log(
      `server listening on port ${port}. Startup took ${Date.now() - start}ms`
    );

    if (cb) {
      cb();
    }
  });
};
