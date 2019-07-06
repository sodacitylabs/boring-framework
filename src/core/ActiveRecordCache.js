const cwd = process.cwd();
const db = require("./Database");

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
        if (!ColumnsCache[table]) {
          const columns = await db
            .connection()
            .table(table)
            .columnInfo();

          ColumnsCache[table] = columns;
        }

        return ColumnsCache[table];
      }
    }
  };
}

module.exports = new ActiveRecordCache();
