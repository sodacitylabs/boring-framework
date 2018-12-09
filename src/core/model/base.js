const db = require("../db/index");

module.exports = class ActiveRecord {
  constructor(attrs) {
    var self = this;

    Object.keys(attrs).forEach(k => {
      self[k] = attrs[k];
    });
  }

  static async all() {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    try {
      const columns = await db
        .connection()
        .table(table)
        .columnInfo();

      const cases = Object.keys(columns).map(k => {
        return {
          snake: k,
          camel: k
            .split("_")
            .map(
              (v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v)
            )
            .join("")
        };
      });

      const rows = await db
        .connection()
        .select()
        .from(table)
        .orderBy("created_at", "asc")
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

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
      console.error(`Exception in ${name}.all :: ${ex.message}`);
      return null;
    }
  }

  static async create(attrs) {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    const columns = await db
      .connection()
      .table(table)
      .columnInfo();

    const cases = Object.keys(columns).map(k => {
      return {
        snake: k,
        camel: k
          .split("_")
          .map((v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v))
          .join("")
      };
    });

    const toCreate = Object.keys(attrs).reduce((acc, curr) => {
      const validColumn = cases.filter(c => c.camel === curr);

      if (validColumn.length) {
        acc[validColumn[0].snake] = attrs[curr];
      }

      return acc;
    }, {});

    try {
      await db
        .connection()
        .insert(toCreate)
        .into(table);

      return new Model(attrs);
    } catch (ex) {
      console.error(`Error in ${name}.create :: ${ex.message}`);
      return null;
    }
  }

  async destroy() {
    const name = this.constructor.name;
    const table = `${name.toLowerCase()}s`;

    try {
      await db
        .connection()
        .table(table)
        .where("id", this.id)
        .del();

      return true;
    } catch (ex) {
      console.error(`Error in ${name}.destroy :: ${ex.message}`);
      return false;
    }
  }

  static async destroyAll() {
    const name = this.constructor.name;
    const table = `${name.toLowerCase()}s`;

    try {
      await db
        .connection()
        .table(table)
        .del();

      return true;
    } catch (ex) {
      console.error(`Error in ${name}.destroyAll :: ${ex.message}`);
      return false;
    }
  }

  static async find(id) {
    // todo: get column definitions and make sure id is of matching type
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    try {
      const row = await db
        .connection()
        .select()
        .from(table)
        .where("id", id)
        .first()
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!row) {
        return null;
      }

      const cases = Object.keys(row).map(k => {
        return {
          snake: k,
          camel: k
            .split("_")
            .map(
              (v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v)
            )
            .join("")
        };
      });
      const attrs = Object.keys(row).reduce((acc, curr) => {
        const validColumn = cases.filter(c => c.snake === curr);

        if (validColumn.length) {
          acc[validColumn[0].camel] = row[curr];
        }

        return acc;
      }, {});

      return new Model(attrs);
    } catch (ex) {
      console.error(`Exception in ${name}.find :: ${ex.message}`);
      return null;
    }
  }

  static async findBy(attrs) {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    try {
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

      const columns = await db
        .connection()
        .table(table)
        .columnInfo();

      const cases = Object.keys(columns).map(k => {
        return {
          snake: k,
          camel: k
            .split("_")
            .map(
              (v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v)
            )
            .join("")
        };
      });

      const rows = await db
        .connection()
        .select()
        .from(table)
        .where(findAttrs)
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

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
      console.error(`Exception in ${name}.findBy :: ${ex.message}`);
      return null;
    }
  }

  static async first(numberOf) {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    try {
      const columns = await db
        .connection()
        .table(table)
        .columnInfo();

      const cases = Object.keys(columns).map(k => {
        return {
          snake: k,
          camel: k
            .split("_")
            .map(
              (v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v)
            )
            .join("")
        };
      });

      const rows = await db
        .connection()
        .select()
        .from(table)
        .orderBy("created_at", "asc")
        .limit(numberOf ? numberOf : 1)
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

      const models = rows.map(r => {
        const attrs = Object.keys(r).reduce((acc, curr) => {
          const column = cases.filter(c => c.snake === curr);

          acc[column.camel] = r[curr];

          return acc;
        }, {});

        return new Model(attrs);
      });

      return models;
    } catch (ex) {
      console.error(`Exception in ${name}.first :: ${ex.message}`);
      return null;
    }
  }

  static async last(numberOf) {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);
    const table = `${name.toLowerCase()}s`;

    try {
      const columns = await db
        .connection()
        .table(table)
        .columnInfo();

      const cases = Object.keys(columns).map(k => {
        return {
          snake: k,
          camel: k
            .split("_")
            .map(
              (v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v)
            )
            .join("")
        };
      });

      const rows = await db
        .connection()
        .select()
        .from(table)
        .orderBy("created_at", "desc")
        .limit(numberOf ? numberOf : 1)
        .catch(err => {
          console.error(`Error caught: ${err.message}`);
        });

      if (!rows || !rows.length) {
        return [];
      }

      const models = rows.map(r => {
        const attrs = Object.keys(r).reduce((acc, curr) => {
          const column = cases.filter(c => c.snake === curr);

          acc[column.camel] = r[curr];

          return acc;
        }, {});

        return new Model(attrs);
      });

      return models;
    } catch (ex) {
      console.error(`Exception in ${name}.first :: ${ex.message}`);
      return null;
    }
  }

  static new(attrs) {
    const name = this.name;
    const Model = require(`${process.cwd()}/app/models/${name}`);

    return new Model(attrs);
  }

  async save() {
    const name = this.constructor.name;
    const table = `${name.toLowerCase()}s`;

    const columns = await db
      .connection()
      .table(table)
      .columnInfo();

    const cases = Object.keys(columns).map(k => {
      return {
        snake: k,
        camel: k
          .split("_")
          .map((v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v))
          .join("")
      };
    });

    const toSave = Object.keys(this).reduce((acc, curr) => {
      const validColumn = cases.filter(c => c.camel === curr);

      if (validColumn.length) {
        acc[validColumn[0].snake] = this[curr];
      }

      return acc;
    }, {});

    try {
      const row = await db
        .connection()
        .select()
        .from(table)
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
          .into(table);
      } else {
        await db
          .connection()
          .insert(toSave)
          .into(table);
      }

      return true;
    } catch (ex) {
      console.error(`Error in ${name}.save :: ${ex.message}`);
      return false;
    }
  }

  async update(args) {
    const name = this.constructor.name;
    const table = `${name.toLowerCase()}s`;

    const columns = await db
      .connection()
      .table(table)
      .columnInfo();

    const cases = Object.keys(columns).map(k => {
      return {
        snake: k,
        camel: k
          .split("_")
          .map((v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substring(1)}` : v))
          .join("")
      };
    });

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

    try {
      await db
        .connection()
        .where("id", this.id)
        .update(toSave)
        .into(table);

      return true;
    } catch (ex) {
      console.error(`Error in ${name}.update :: ${ex.message}`);
      return false;
    }
  }
};
