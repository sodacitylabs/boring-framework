# Command Line
Much of what you'll do when working with The Boring Framework will be done via the Command Line. This approach puts you in full control of what you want to do, while abstracting away the mundane tasks like file creation and naming.

There are a few commands in the CLI that you'll typically use:

| Command | Description |
| --------- | ----------- |
| new | This will create a new application as a folder in the directory you run this from |
| generate | The most frequently used command. This is for creating controllers, models and actions |
| migrate | this will migrate up your database |
| test | this will run your test suite for you |
| server | Starts your application server and begins listening for requests |

## New
The `new` command is run once at the start of your project. It creates a new folder with all of your application code inside of it.

## Generate
The `generate` command is where you create your controllers, models and actions for those controllers. When you create new models and controllers, your test suite for that file is also created for you.

## Migrate
This command syncs your database with your migrations file to make sure the database schema is up to date. Pass an argument which direction you want to go `up` to apply or `down` to rollback.

## Test
This runs your test suite.

## Server
This starts your web server and begins listening for incoming HTTP requests. By default, the server listens on port 3000 but you can change this by modifying the port specified in `/config/environments/all.js`. To enable watching of your files to restart the server, pass an additional `--reload` arg to this command.

However, you are not limited to these commands. As you become more comfortable using Boring, you'll potentially want to use some additional helper commands. Those are:

| Command | Description |
| --------- | ----------- |
| about | This will print information about your project from package.json etc. |
| compile | This will compile your client side code i.e. CSS and Javascript etc. |
| routes | This lists all the routes that your code will respond to |
| todo | This will crawl your code for fixme, todo, note comments |

## Routes
The `routes` command will crawl your project for Controllers and Actions to print them out to the console. An example might look something like this:

| Verb | URL | Controller#Action |
| ------------- | ------- | ---- |
| GET | /hello | hello#index |
| GET | / | hello#index |
