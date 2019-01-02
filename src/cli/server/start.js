"use strict";

const http = require("http");
const Router = require("../../core/router");
const { spawnSync } = require("child_process");

module.exports = function(cb) {
  const dir = process.cwd();
  const config = require(`${dir}/config`);
  const port = config.server.port || 3000;
  const start = Date.now();
  const instance = http.createServer(Router.incoming);

  Router.load();

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
