const fs = require("fs");
const Boring = require("../src/core");

async function test() {
  try {
    const cli = new Boring.CLI();
    const dir = process.cwd();
    const testDirectory = `${dir}/test`;

    let tests = [];

    tests = tests.concat(
      fs
        .readdirSync(`${testDirectory}/model`)
        .map(f => `${testDirectory}/model/${f}`)
    );

    cli.runTests(tests);
  } catch (ex) {
    console.error(`Error running tests: ${ex.message}`);
    process.exit(1);
  }
}

(async () => {
  await test();
})();
