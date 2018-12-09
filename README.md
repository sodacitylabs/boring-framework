# The Boring Framework
The Boring Framework is a Rails-inspired web framework that includes everything needed to
create database-backed web applications according to the
[Model-View-Controller (MVC)](https://en.wikipedia.org/wiki/Model-view-controller)
pattern.

MVC divides your application into three main layers: Model, View, and Controller.

## Model layer
_**FILL ME IN PLEASE**_

## Controller layer

The _**Controller layer**_ is responsible for handling incoming HTTP requests and
providing a suitable response.

Usually this means returning HTML, but controllers can also generate XML, JSON,
PDFs, mobile-specific views, and more. Controllers load and manipulate Models, and
render Views in order to generate the appropriate HTTP response.

Incoming requests are routed to an appropriate Controller dynamically based on the URL.
The specific function that will handle that request is called an _Action_.

| HTTP Verb | Path | Action | Description |
| --------- | ---- | ------- | ----------- |
| `GET` | `/messages` | `list` | get a list of messages as JSON |
| `POST` | `/messages` | `create` | create a new message |
| `GET` | `/messages/:id` | `find` | get a specific message as JSON |
| `PUT` | `/messages/:id` | `update` | update a specific message |
| `DELETE` | `/messages/:id` | `destroy` | delete a specific message |

When dealing with Views for rendering UIs the same naming conventions are:

| HTTP Verb | Path | Action | Description |
| --------- | ---- | ------- | ----------- |
| `GET` | `/messages` | `index` | a UI with a list of messages |
| `GET` | `/messages/new` | `new` | a UI with a form to create a new message |
| `GET` | `/messages/:id` | `show` | a UI with a specific message |
| `GET` | `/messages/:id/edit` | `edit` | a UI with a form to update a message |

## View layer

The _**View layer**_ is composed of "templates" that are responsible for providing
appropriate representations of your application's resources. Templates are HTML with
embedded Javascript code (EJS files). Views are typically rendered to generate a controller
response, or to generate the body of an email.

Views are handled by [EJS](http://ejs.co/).

## Frameworks and libraries

No outside frameworks or libraries are used at this time.

## Getting Started

We try to maintain clear, concise documentation for Getting Started and using The Boring Framework. Check out our [docs](https://github.com/sodacitylabs/boring-framework/wiki) pages for any questions you have!

## License

_**FILL THIS IN TO PREVENT COMMERCIAL USE OF THE CODE, BRAND, ETC**_
