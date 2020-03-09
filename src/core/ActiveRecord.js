const NounHelper = require("./helpers/NounHelper");
const { Model, knexSnakeCaseMappers } = require("objection");
const Knex = require("knex");
const dbInfo = require(`${process.cwd()}/config`).get("db");

Model.knex(Knex(Object.assign(dbInfo, knexSnakeCaseMappers(), {})));

module.exports = class ActiveRecord extends Model {
  static get tableName() {
    return NounHelper.toPluralResource(this.name);
  }

  static all() {
    return this.query();
  }

  static create(attrs) {
    return this.query().insert(attrs);
  }

  static destroy(id) {
    return this.query().deleteById(id);
  }

  static find(id) {
    return this.query().findById(id);
  }

  static findBy(attrs) {
    return this.query().where(attrs);
  }

  static update(args) {
    return this.query()
      .findById(this.id)
      .patch(args);
  }
};
