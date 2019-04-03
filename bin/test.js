const fs = require("fs");
const runTests = require("../src/cli/test");

async function test() {
  try {
    const dir = process.cwd();
    const testDirectory = `${dir}/test`;

    let tests = [];

    tests = tests.concat(
      fs
        .readdirSync(`${testDirectory}/helpers`)
        .map(f => `${testDirectory}/helpers/${f}`)
    );
    tests = tests.concat(`${testDirectory}/ActiveRecordTest.js`);
    tests = tests.concat(`${testDirectory}/RouterTest.js`);

    runTests(tests);
  } catch (ex) {
    console.error(`Error running tests: ${ex.message}`);
    process.exit(1);
  }
}

(async () => {
  await test();
})();
