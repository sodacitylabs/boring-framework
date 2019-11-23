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

## Test Environment
Your test suite will always be run with NODE_ENV=test and draws its configurations from your `/config` folder just like any other environment you may have.

## Running Tests
To run the Test Runner, simply use the provided CLI command:
```
$ ./bin/boring.sh test
```

## Your first test
If you followed along in [Getting Started](https://github.com/sodacitylabs/boring-framework/docs/tutorials/getting-started.md) then you'll recall creating your BlogPost Model with:
```
$ ./bin/boring.sh generate controller BlogPosts new
```
That also created an additional file for you:
```
test/controllers/BlogPostsController.js
```
Your test file defaults to this:
```
const Controller = require("../../app/controllers/BlogPostsController.js");

test("returns false", () => {
  return false;
});
```

Running the ``./bin/boring.sh test` command ( which is just a wrapper of `npm test` ) will fail because this is not a valid test for Jest to run. Let's fix that.

### Creating tests
WIP

### Assertions
Jest has [baked-in assertions](https://jestjs.io/docs/en/expect)

## Testing Controllers
WIP

### Your first IntegrationTest
WIP

### Creating additional tests
WIP
