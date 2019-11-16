const cwd = process.cwd();
const db = require("./Database");

let columnsSemaphore = false;

function ActiveRecordCache() {
  let ModelCache = {};
  let ColumnsCache = {};

  return {
    Model: {
      find: model => {
        if (!ModelCache[model]) {
          ModelCache[model] = require(`${cwd}/app/models/${model}`);
        }

        return ModelCache[model];
      }
    },
    Columns: {
      find: async table => {
        if (!ColumnsCache[table] && !columnsSemaphore) {
          columnsSemaphore = true;

          const columns = await db
            .connection()
            .table(table)
            .columnInfo();

          if (!ColumnsCache[table]) {
            ColumnsCache[table] = columns; // eslint-disable-line require-atomic-updates
          }
        }

        return ColumnsCache[table];
      }
    }
  };
}

module.exports = new ActiveRecordCache();
