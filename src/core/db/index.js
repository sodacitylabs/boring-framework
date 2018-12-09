module.exports = {
  connection: function() {
    const db = require(`${process.cwd()}/db`);

    return db;
  }
};
