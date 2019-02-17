const Boring = require("../../src/core");
const UnitTest = Boring.Test.UnitTest;
const IntegrationTest = Boring.Test.IntegrationTest;

async function runTests(activeInstance) {
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

      if (instance instanceof UnitTest || instance instanceof IntegrationTest) {
        console.log(`${TestClass.name}`);

        let success = await runTests(instance);

        if (!success) {
          return false;
        }
      } else {
        throw new Error(
          `${tests[k]} not instanceof UnitTest or IntegrationTest`
        );
      }
    }
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
};
