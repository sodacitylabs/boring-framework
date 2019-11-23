# Testing Boring Apps
The goal of testing infrastructures should be that its simple, easy and hopefully fast. There's lots of thoughtspeak on where to focus your tests but Boring doesn't force any particular paradigm on you. The test runner is just a wrapper around [Jest](https://jestjs.io/en/).

## Test Folder Setup
Your `test` folder is setup for you by default when you create a `new` project. The default structure of it looks like:

| File / Folder | Purpose |
| ------------- | ------- |
| controllers/ | http based tests for your controller actions |
| fixtures/ | scaffolding of fake test data |
| helpers/ | tests of shared code used throughout your app |
| models/ | testing the shape and behavior of data |
| setup/ | setup files used by Jest before running your test suite |

## Test Environment
Your test suite will always be run with NODE_ENV=test and draws its configurations from your `/config` folder just like any other environment you may have.

## Running Tests
To run the Test Runner, simply use the provided CLI command:
```bash
$ ./bin/boring.sh test
```

## Your first test
If you followed along in [Getting Started](https://github.com/sodacitylabs/boring-framework/docs/tutorials/getting-started.md) then you'll recall creating your Hello Controller with:
```bash
$ ./bin/boring.sh generate controller Hello index
```
That also created an additional file for you:
```
test/controllers/HelloController.test.js
```
Your test file defaults to this:
```javascript
const Controller = require("../../app/controllers/Hello.js");

test("returns false", async () => {
  return false;
});
```

Running the ``./bin/boring.sh test` - or `npm test` - command will fail because this is not a valid test for Jest to run. Let's fix that.

## Testing Controllers
Testing controllers is done by `inject`ing fake HTTP requests to the Controllers using the baked-in behavior provided by Fastify. Boring - with the help of Jest - makes the Fastify routes available as a global object. This means that in your tests, you can just reference `fastify` and this holds all the routes etc. of your application. So, lets test our Hello Controller just to make sure it's working. Change the default test to have the following:

```javascript
test("responds with a 200", async (done) => {
  fastify
    .inject({
      method: 'GET',
      url: '/hellos'
    })
    .then(response => {
      done();
    })
    .catch(err => {
      done(err);
    })
});
```

Since the Hello controller is your default route, you could optionally make the test:

```javascript
test("responds with a 200", async (done) => {
  fastify
    .inject({
      method: 'GET',
      url: '/'
    })
    .then(response => {
      done();
    })
    .catch(err => {
      done(err);
    })
});
```

There's another construct here that jest provides, the `done` callback. This lets you tell Jest when the test has finished. Calling `done()` will tell Jest that the test completed successfully whereas calling `done(err)` tells Jest that this test failed.

However, we're not always going to test something so simpled and we'll need to Assert that values are as we [Expect](https://jestjs.io/docs/en/expect) them to be. All of this is provided by Jest.

## Making Assertions
Lets test a more complex controller now. Inside the test file for our BlogPosts Controller, delete the default test and add the following:

```javascript
test("creates a new BlogPost", async (done) => {
  fastify
    .inject({
      method: 'POST',
      url: '/blog_posts',
      payload: {
        title: 'Fake Blog from Test',
        text: 'This was a fake post created by the test suite!'
      }
    })
    .then(response => {
      expect(response.statusCode).toBe(201);
      expect(response.body.indexOf('/blog_posts/')).toBe(0);
      done();
    })
    .catch(err => {
      done(err);
    })
});
```

## Testing Models
Testing models is done by calling ActiveRecord functions to create data and then asserting on that data afterwards. A basic test would resemble this:

```javascript
test("creates a new BlogPost", async () => {
  const title = 'Fake BlogPost Model';
  const text = 'Fake BlogPost created in Model test suite';
  const created = await Model.create({ title, text });

  expect(created).toBeTruthy();
});
```

However, as our domain logic gets more complex we may add additional functions to our Model and we can test that logic. For instance, perhaps we want to show previews of our BlogPosts instead of just listing the title. That could be accomplished by creating a preview method in our Model like so:

```javascript
  previewText() {
    return `${this.text.slice(0, 50)}...`;
  }
```

We could assert on that property in a test so that we know when we break that logic:

```javascript
test("shows a preview of the blog post", async () => {
  const title = 'Fake BlogPost Model';
  const text = 'Fake BlogPost created in Model test suite';
  const previewable = await Model.create({ title, text });

  expect(previewable).toBeTruthy();
  expect(previewable.previewText()).toBe(`${text.slice(0, 50)}...`);
});
```
