module.exports = {
  /**
   * @description get current db connection for running web application
   * @returns the knex handle to the database for a web application
   */
  connection: function() {
    const db = require(`${process.cwd()}/db`);

    return db;
  }
};
