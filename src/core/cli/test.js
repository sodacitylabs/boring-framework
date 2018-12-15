const ActiveTest = require("../test/index").ActiveTest;
const IntegrationTest = require("../test/index").IntegrationTest;

async function runActiveTests(activeInstance) {
  const tests = Object.getOwnPropertyNames(
    Object.getPrototypeOf(activeInstance)
  ).filter(k => k !== "constructor");

  if (!tests.length) {
    console.log("  NO TESTS TO RUN");
    return true;
  }

  for (let k = 0; k < tests.length; k++) {
    const methodName = tests[k];

    try {
      let failed = false;

      await activeInstance[methodName]()
        .then(() => {
          console.log("  " + methodName + " :: PASSED");
        })
        .catch(ex => {
          console.log("  " + methodName + " :: FAILED");
          console.log(ex);
          failed = true;
        });

      if (failed) {
        return false;
      }
    } catch (ex) {
      console.log("  " + methodName + " :: FAILED");
      console.log(ex);
      return false;
    }
  }

  return true;
}

module.exports = async function(tests) {
  try {
    for (let k = 0; k < tests.length; k++) {
      const TestClass = require(`${tests[k]}`);
      const instance = new TestClass();

      if (
        instance instanceof ActiveTest ||
        instance instanceof IntegrationTest
      ) {
        console.log(`${TestClass.name}`);

        let success = await runActiveTests(instance);

        if (!success) {
          return false;
        }
      } else {
        throw new Error(`${tests[k]} not instanceof ActiveTest`);
      }
    }
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
};
