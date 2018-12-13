const fs = require("fs");
const ActiveTest = require("../test/index").ActiveTest;

async function runActiveTests(activeInstance) {
  const tests = Object.getOwnPropertyNames(
    Object.getPrototypeOf(activeInstance)
  ).filter(k => k !== "constructor");

  for (let k = 0; k < tests.length; k++) {
    const methodName = tests[k];
    const method = activeInstance[methodName];

    try {
      let failed = false;

      await method()
        .then(() => {
          console.log("  " + methodName + " :: PASSED");
        })
        .catch(() => {
          console.log("  " + methodName + " :: FAILED");
          failed = true;
        });

      if (failed) {
        return failed;
      }
    } catch (ex) {
      console.log("  " + methodName + " :: FAILED");
      return false;
    }
  }
}

module.exports = async function() {
  const dir = process.cwd();
  const testDirectory = `${dir}/test`;

  let tests = [];

  tests = tests.concat(
    fs
      .readdirSync(`${testDirectory}/controllers`)
      .map(f => `${testDirectory}/controllers/${f}`)
  );
  tests = tests.concat(
    fs
      .readdirSync(`${testDirectory}/models`)
      .map(f => `${testDirectory}/models/${f}`)
  );

  try {
    for (let k = 0; k < tests.length; k++) {
      const TestClass = require(`${tests[k]}`);
      const instance = new TestClass();

      if (instance instanceof ActiveTest) {
        console.log(`${TestClass.name}`);

        let success = await runActiveTests(instance);

        if (!success) {
          return;
        }
      } else {
        throw new Error(`${tests[k]} not instanceof ActiveTest`);
      }
    }
  } catch (ex) {
    console.log(ex.message);
  }
};
