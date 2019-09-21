const fs = require("fs");
const UrlHelper = require("./UrlHelper");

module.exports = class AssetHelper {
  /**
   * @description returns a map of file extensions to their MIME types
   *
   * @example https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
   *
   * @returns {Object} map of extension -> MIME types
   */
  static get types() {
    return {
      css: "text/css",
      eot: "application/vnd.ms-fontobject",
      gif: "image/gif",
      htm: "text/html",
      html: "text/html",
      ico: "image/x-icon",
      jpg: "image/jpg",
      jpeg: "image/jpeg",
      js: "application/javascript",
      otf: "font/otf",
      png: "image/png",
      svg: "image/svg+xml",
      txt: "text/plain",
      woff: "font/woff",
      woff2: "font/woff2"
    };
  }

  /**
   * @description - serve a file thats in the public /assets folder
   *
   * @param {*} req - core Node.js request object
   * @param {*} res - core Node.js response object
   */
  static serve(req, res) {
    try {
      const dir = process.cwd();
      const urlObj = UrlHelper.parse(req.url);
      const assetPath = urlObj.pathname.split("/assets/").splice(1)[0];
      const asset = fs.readFileSync(`${dir}/public/assets/${assetPath}`);
      const ext = assetPath.split(".").pop();
      const type = this.types[ext] || undefined;

      if (!type) {
        throw new Error(`asset type ${ext} was not recognized`);
      } else if (!asset) {
        throw new Error(`asset ${assetPath} not found`);
      }

      res.writeHead(200, {
        "Content-Length": Buffer.byteLength(asset),
        "Content-Type": type,
        "Cache-Control": "public, max-age=31557600"
      });
      res.write(asset, "binary");
      res.end();
    } catch (ex) {
      res.writeHead(400, {
        "Content-Length": Buffer.byteLength("")
      });
      res.write("");
      res.end();
    }
  }

  /**
   * @description - serve a robots.txt file
   *
   * @param {*} req - core Node.js request object
   * @param {*} res - core Node.js response object
   */
  static robots(req, res) {
    try {
      const dir = process.cwd();
      const robots = fs.readFileSync(`${dir}/public/robots.txt`);

      res.writeHead(200, {
        "Content-Length": Buffer.byteLength(robots),
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400"
      });
      res.write(robots, "binary");
      res.end();
    } catch (ex) {
      res.writeHead(400, {
        "Content-Length": Buffer.byteLength()
      });
      res.write("");
      res.end();
    }
  }
};
