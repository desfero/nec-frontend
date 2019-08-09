const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const TIMEOUT_SECONDS = 3;
const NUMBER_OF_RETRIES = 3;

const getApiSha = async (retries = NUMBER_OF_RETRIES) => {
  try {
    const { commitSha } = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "..", "health-check-sha.json")),
    );

    exec(
      `./run_backend.sh ${commitSha}
      `,
      (err, stdout) => {
        if (err) {
          console.error(err);
          if (retries > 0) {
            console.log(`Retrying again in ${TIMEOUT_SECONDS} second`);
            setTimeout(() => getApiSha(retries - 1), TIMEOUT_SECONDS * 1000);
          } else {
            console.log(`Failed after ${NUMBER_OF_RETRIES}`);
            return;
          }
          return;
        }
        console.log(stdout);
      },
    );
  } catch (e) {
    console.log("There was an error while trying to read health-check-sha.json", e);
  }
};

getApiSha();
