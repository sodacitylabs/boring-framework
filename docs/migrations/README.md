# Database Migrations
Migrations are small, incremental changes to your database schema over time. They allow you to incrementally build your database - or apply them all at once to recreate the database - without having to maintain an enormous DDL. Migrations are run via [Knex](knexjs.org) and are just javascript code and not actual sql.

Here's an example of a migration that when `up`ed (applied) will create a new table called `users` and if it is `down`ed (rolled back) it will drop that table:
```
exports.up = async knex => {
  await knex.schema.dropTableIfExists("users");
  await knex.schema.createTable("users", table => {
    table.uuid("id").primary();
    table.text("email");
    table.timestamps(true, true);
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists("users");
};
```

## Creating Migrations
Migrations are created in a variety of ways, the most common of which is when you create a new Model. For example, to generate the migration above through Model creation, simply run this command:
```
$ ./bin/boring.sh generate model User email:text
```
Note that you dont need to provide an `id` as Boring will automatically create a `uuid` column for you.

If perhaps you already have your database and you're looking to add a migration that doesn't require a new model, simply run the `generate` command for a new `migration` like so:
```
$ ./bin/boring.sh generate migration create_users
```
You would find yourself with an empty migration file like so:
```
exports.up = async knex => {
};

exports.down = async knex => {
};
```

## Applying Migrations
To apply migrations simply use the CLI to apply all of the latest migrations:
```
$ ./bin/boring.sh migrate up
```

## Rolling back Migrations
To rollback the most recent migration simply use the CLI as well:
```
$ ./bin/boring.sh migrate down
```

## Seeding data
Currently, seeding data through the CLI is not supported.
