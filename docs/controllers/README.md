# Controller Basics
Controllers are the C in MVC - the controller - which is the layer for handling http-based requests to your application. Controllers typically describe the steps required to interact with data and show it to an end user.


## Naming Conventions
Controllers are named using the _plural_ form of a Resource i.e. a Controller for handling requests for a `BlogPost` Model, would go to a `BlogPostsController`.

_Note:_ it's currently not possible to override this default behavior. In a future release, you'll be able to create custom route mappings to a particular controller.


## Action Methods
Controllers have a standard set of _actions_ that are handled by the Router. Incoming requests have their URL mapped to those actions:

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

Those functions are then implemented in your Controllers like so:
```javascript
const Boring = require("@sodacitylabs/boring-framework");
const RequestController = Boring.Controller.RequestController;

module.exports = class HelloController extends RequestController {
  static async index(req, res) {
    try {
      res.render();
    } catch (ex) {
      res.code(500).send();
    }
  }
};
```

## URL Handling
When an incoming HTTP Request is seen, Boring will attempt to parse the URL enough to determine which Controller / Action to send the Request and Response to. URLs are pattern-matched as shown above so getting a specific Customer at `/customers/123456` would map to `/customers/:id`. The Request object in your controller would then have a `params` property on it that looks like:

```javascript
req: {
  params: {
    id: 1234567
  }
  // additional properties
}
```

For POST and PUT based HTTP requests, Boring will also attach a `body` property to the Request that might look something like:

```javascript
req: {
  body: {
    name: {
      first: `My First Name`,
      last: `My Last Name
    }
  }
  // additional properties
}
```

You can also parse the URL yourself in your code, should you need to, to get query string, hash, etc. information like so:

```javascript
const url = require('url'); // require in the Node.js module

const parsedURL = url.parse(req.url); // parse the URL in your Controller code
```

## Request and Response Objects
Each incoming http request is just the core [IncomingMessage](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage) object provided by Node.js; the same goes for the Response object.

Boring will attempt to add additional properties to the object at runtime to help you write less code. Some of those are:

| Property / Function | Description |
| --------- | ----------- |
| body | for POST and PUT requests, stream the buffer in and attach JSON to the request |
| params | a map of the pattern-matching parameters in your URL i.e. `id` or `blog_post_id` |
| send | a short-hand function for sending an http response |
| redirectTo | a short-hand function for redirecting to a different URL |
| render | will render a UI template and return it as HTML on the response |

## HTTP vs HTTPS
Currently, Boring only supports HTTP listening. In a future release this will be configurable.

## Middlewares
Middleware are functions that you can specify to run before every action gets invoked. Currently, middlewares are not supported and should be done inside of your Controller Action.

## Rescuing
Rescuing is the ability to define behavior should an Error be thrown either in the routing process or inside of a Controller Action. For now, that behavior is not implemented and is left up to you to write the code for should you need it.
