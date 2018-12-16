const fs = require("fs");
const runTests = require("../src/cli/test");

async function test() {
  try {
    const dir = process.cwd();
    const testDirectory = `${dir}/test`;

    let tests = [];

    tests = tests.concat(
      fs
        .readdirSync(`${testDirectory}/model`)
        .map(f => `${testDirectory}/model/${f}`)
    );
    tests = tests.concat(
      fs
        .readdirSync(`${testDirectory}/helpers`)
        .map(f => `${testDirectory}/helpers/${f}`)
    );

    runTests(tests);
  } catch (ex) {
    console.error(`Error running tests: ${ex.message}`);
    process.exit(1);
  }
}

(async () => {
  await test();
})();
