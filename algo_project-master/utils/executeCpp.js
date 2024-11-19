const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const command = inputPath 
      ? `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}` 
      : `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else if (stderr) {
        reject({ error: stderr });
      } else {
        resolve(stdout.trim()); // Return output without extra spaces
      }
    });
  });
};

module.exports = {
  executeCpp,
};
