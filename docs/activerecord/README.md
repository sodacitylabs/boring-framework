# ActiveRecord
ActiveRecord is the M in MVC - the model - which is the layer for representing business data and (sometimes) logic. [ActiveRecord](https://en.wikipedia.org/wiki/Active_record_pattern) was coined by [Martin Fowler](https://www.martinfowler.com/eaaCatalog/activeRecord.html) in his 2003 book _Patterns of Enterprise Application Architecture_.

One key point of ActiveRecord is that your objects will have both the shape of your data, as well as logic for manipulating that data. Using ActiveRecord effectively will keep your data and logic isolated to a Model, as well as writing less database access code. Using ActiveRecord conventions will significantly lessen the overhead of maintaining and interacting with your database.


## Core Features
ActiveRecords have a limited set of functions that you'll commonly use to interact with your database.

| Function | Description |
| --------- | ----------- |
| `all` | get all rows in your database for a given model |
| `create` | insert a new row in your database based on the model values |
| `destroy` | delete a row from your database based on the model's `id` |
| `find` | find a row from your database based on the given `id` value |
| `findBy` | find multiple rows from your database based on provided key/value pairs |
| `new` | create an ActiveRecord object without saving to the database |
| `save` | insert or update a row in the database based on the model values |
| `update` | update a row in the database based on the model values |


## Naming Conventions
ActiveRecord uses specific naming conventions for mapping Models to database table names and columns. A Model should have a singular form while the database table will be Plural. The database table name and columns are also snake-cased around capital letters so `BlogPost` would map to `blog_posts` whereas `Blogpost` would map to `blogposts`.

| Model | Table Name |
| --------- | ----------- |
| `BlogPost` | `blog_posts` |
| `Comment` | `comments` |


## Schema Conventions
ActiveRecord has conventions for building database tables as well. For table names, snake-cased plural form is used. For column names within those tables, snake-cased singular form is used. Our tables from above might look something like

| blog_posts | comments |
| --------- | ----------- |
| id | id |
|  | blog_post_id |

By default, `id` columns are `uuid` types. This helps to avoid out of space issues with standard auto-incrementing numbers as well as contention amongst resources. Additonal columns for record keeping will be used for when records were created and last updated.

## Creating Models
Creating ActiveRecord Models is quick and easy. Suppose you already have a table, Authors, that was not created via Boring. You can create a new model like so:

```
const db = require('../../db');
const Boring = require('@sodacitylabs/boring-framework');
const ActiveRecord = Boring.Model.ActiveRecord;

module.exports = class Author extends ActiveRecord {
  constructor(attrs) {
    super(attrs);
  }
};
```

This creates a Model that maps to an `authors` table in your database. All columns in your database will automatically be converted to camelCase and can be referenced in your Model.

## Overriding Conventions
Currently, the only possible override is for the table name backing the model. For instance, if you want a `BlogPost` Model but have a legacy table named `articles` you can add this code to your BlogPost Model:
```
static get tableName() {
  return "articles";
}
```

## Migrations
ActiveRecord Migrations are managed via [Knex](https://knexjs.org/). An example of a migration file might look like:

```
exports.up = async function(knex) {
  await knex.schema.dropTableIfExists('blog_posts');
  await knex.schema.createTable('blog_posts', (table) => {
    table.uuid('id').primary();
    table.string('title');
    table.text('text');

    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('blog_posts');
};
```

## Validations
Currently, it isnt possible to add validations. This is currently a potential candidate as part of the V1 Release.

## Callbacks
Currently, it isnt possible to add callbacks. This is not currently planned as part of any release.
