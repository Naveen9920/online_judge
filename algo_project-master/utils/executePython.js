const { exec } = require('child_process');
const fs = require("fs");
const path = require('path');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        const command = inputPath 
            ? `python3 ${filepath} < ${inputPath}` 
            : `python3 ${filepath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error: error.message, stderr });
            } else if (stderr) {
                reject({ error: stderr });
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

module.exports = {
    executePython,
};
