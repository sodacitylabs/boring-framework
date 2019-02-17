"use strict";

/**
 * short-hand method to send an http code and data. Attaches to response object.
 */
module.exports = function(code, data) {
  try {
    if (data) {
      const content = typeof data === "object" ? JSON.stringify(data) : data;
      this.writeHead(code, {
        "Content-Length": Buffer.byteLength(content),
        "Content-Type": "application/json"
      });
      this.write(content);
    } else {
      this.writeHead(code);
    }
    this.end();
  } catch (ex) {
    this.writeHead(500);
    this.end();
  }
};
