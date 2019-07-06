const db = require("./Database");
const NounHelper = require("./helpers/NounHelper");
const ActiveRecordCache = require("./ActiveRecordCache");

// todo: move this to a helper
function mapColumnsToSnake(columns) {
  return Object.keys(columns).map(k => {
    return {
      snake: k,
      camel: k
        .split("_")
        .map((v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v))
        .join("")
    };
  });
}

module.exports = class ActiveRecord {
  constructor(attrs) {
    var self = this;

    Object.keys(attrs).forEach(k => {
      self[k] = attrs[k];
    });
  }

  static get modelName() {
    return NounHelper.getSingularForm(this.name);
  }

  static get tableName() {
    return NounHelper.toPluralResource(this.name);
  }

  static async all() {
    try {
      const Model = ActiveRecordCache.Model.find(this.modelName);
      const columns = await ActiveRecordCache.Column.find(this.tableName);
      const rows = await db
        .connection()
        .select()
        .from(this.tableName)
        .orderBy("created_at", "asc")
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

      const cases = mapColumnsToSnake(columns);
      const models = rows.map(r => {
        const attrs = Object.keys(r).reduce((acc, curr) => {
          const column = cases.filter(c => c.snake === curr)[0];

          acc[column.camel] = r[curr];

          return acc;
        }, {});

        return new Model(attrs);
      });

      return models;
    } catch (ex) {
      console.error(`Exception in ${this.modelName}.all :: ${ex.message}`);
      return null;
    }
  }

  static async create(attrs) {
    try {
      const Model = ActiveRecordCache.Model.find(this.modelName);
      const columns = await ActiveRecordCache.Column.find(this.tableName);
      const cases = mapColumnsToSnake(columns);
      const toCreate = Object.keys(attrs).reduce((acc, curr) => {
        const validColumn = cases.filter(c => c.camel === curr);

        if (validColumn.length) {
          acc[validColumn[0].snake] = attrs[curr];
        }

        return acc;
      }, {});

      await db
        .connection()
        .insert(toCreate)
        .into(this.tableName);

      return new Model(attrs);
    } catch (ex) {
      console.error(`Error in ${this.modelName}.create :: ${ex.message}`);
      return null;
    }
  }

  async destroy() {
    try {
      await db
        .connection()
        .table(this.constructor.tableName)
        .where("id", this.id)
        .del();

      return true;
    } catch (ex) {
      console.error(
        `Error in ${this.constructor.modelName}.destroy :: ${ex.message}`
      );
      return false;
    }
  }

  static async find(id) {
    try {
      const Model = ActiveRecordCache.Model.find(this.modelName);
      const row = await db
        .connection()
        .select()
        .from(this.tableName)
        .where("id", id)
        .first()
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!row) {
        return null;
      }

      const cases = mapColumnsToSnake(row);
      const attrs = Object.keys(row).reduce((acc, curr) => {
        const validColumn = cases.filter(c => c.snake === curr);

        if (validColumn.length) {
          acc[validColumn[0].camel] = row[curr];
        }

        return acc;
      }, {});

      return new Model(attrs);
    } catch (ex) {
      console.error(`Exception in ${this.modelName}.find :: ${ex.message}`);
      return null;
    }
  }

  static async findBy(attrs) {
    try {
      const Model = ActiveRecordCache.Model.find(this.modelName);
      let findAttrs = {};

      Object.keys(attrs).forEach(a => {
        const chars = a.split("");
        const snake = [];

        chars.forEach(c => {
          if (c === c.toUpperCase()) {
            snake.push("_");
          }

          snake.push(c.toLowerCase());
        });

        findAttrs[snake.join("")] = attrs[a];
      });

      const columns = await ActiveRecordCache.Column.find(this.tableName);
      const rows = await db
        .connection()
        .select()
        .from(this.tableName)
        .where(findAttrs)
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

      const cases = mapColumnsToSnake(columns);
      const models = rows.map(r => {
        const attrs = Object.keys(r).reduce((acc, curr) => {
          const column = cases.filter(c => c.snake === curr)[0];

          acc[column.camel] = r[curr];

          return acc;
        }, {});

        return new Model(attrs);
      });

      return models;
    } catch (ex) {
      console.error(`Exception in ${this.modelName}.findBy :: ${ex.message}`);
      return null;
    }
  }

  static new(attrs) {
    const Model = ActiveRecordCache.Model.find(this.modelName);

    return new Model(attrs);
  }

  async save() {
    try {
      const columns = await ActiveRecordCache.Column.find(
        this.constructor.tableName
      );
      const cases = mapColumnsToSnake(columns);
      const toSave = Object.keys(this).reduce((acc, curr) => {
        const validColumn = cases.filter(c => c.camel === curr);

        if (validColumn.length) {
          acc[validColumn[0].snake] = this[curr];
        }

        return acc;
      }, {});

      if (this.id) {
        const row = await db
          .connection()
          .select()
          .from(this.constructor.tableName)
          .where("id", this.id)
          .first()
          .catch(err => {
            console.log(`Error caught: ${err.message}`);
          });

        if (row && row.length) {
          await db
            .connection()
            .where("id", this.id)
            .update(toSave)
            .into(this.constructor.tableName);
        } else {
          return false;
        }
      } else {
        const result = await db
          .connection()
          .returning(["id"])
          .insert(toSave)
          .into(this.constructor.tableName);

        if (typeof result[0] === "object") {
          this.id = result[0].id;
        } else {
          this.id = result[0];
        }
      }

      return true;
    } catch (ex) {
      console.error(
        `Error in ${this.constructor.modelName}.save :: ${ex.message}`
      );
      return false;
    }
  }

  async update(args) {
    try {
      const columns = await ActiveRecordCache.Columns.find(
        this.constructor.tableName
      );
      const cases = mapColumnsToSnake(columns);
      const current = Object.keys(this).reduce((acc, curr) => {
        if (curr === "id") {
          return acc;
        }

        const validColumn = cases.filter(c => c.camel === curr);

        if (validColumn.length) {
          acc[validColumn[0].snake] = this[curr];
        }

        return acc;
      }, {});
      const toSave = Object.assign({}, current, args);

      await db
        .connection()
        .where("id", this.id)
        .update(toSave)
        .into(this.constructor.tableName);

      return true;
    } catch (ex) {
      console.error(
        `Error in ${this.constructor.modelName}.update :: ${ex.message}`
      );
      return false;
    }
  }
};
