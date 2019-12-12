# The Boring Framework
The Boring Framework is a Rails-inspired web framework that includes everything needed to create database-backed web applications and APIs according to the [Model-View-Controller (MVC)](https://en.wikipedia.org/wiki/Model-view-controller)pattern.

MVC divides your application into three main layers: Model, View, and Controller.

## Technology Stack
Under the covers - and sometimes not so much - Boring is just a project wrapper around common Node.js technologies, the core of which are:

- **[Fastify](https://www.fastify.io/)** The entire web server runs as a Fastify application: routing, http, logging, etc.
- **[Jest](https://jestjs.io/)** All of the testing is provided via Jest. Tests, Mocking, etc.
- **[EJS](https://ejs.co/)** The rendering of HTML-based pages is done via EJS. It has a similar syntax to Embedded Ruby (`.erb`) as well as other template languages.
- **[Objection](https://vincit.github.io/objection.js/)** Objection is how [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern) is implemented. Models inherit from Objection which is an ORM over [knex](http://knexjs.org/).
- **[Nodemailer](https://nodemailer.com/about/)** Nodemailer - and its plugin sytem - is how emails are sent.

## Getting Started

We try to maintain clear, concise documentation for Getting Started and using The Boring Framework. Check out our [docs](https://github.com/sodacitylabs/boring-framework/wiki) pages for any questions you have!
