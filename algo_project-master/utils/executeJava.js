const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputContent = null) => {
    const jobId = path.basename(filePath, '.java');
    const outPath = path.join(outputPath, jobId);
    const inputPath = inputContent ? path.join(outputPath, `${jobId}.txt`) : null;

    return new Promise((resolve, reject) => {
        if (inputContent) {
            fs.writeFileSync(inputPath, inputContent);
        }

        exec(`javac ${filePath} -d ${outputPath}`, (compileError, compileStdout, compileStderr) => {
            if (compileError || compileStderr) {
                return reject(`Compilation Error: ${compileError || compileStderr}`);
            }

            let command = `java -cp ${outputPath} ${jobId}`;
            if (inputPath) {
                command += ` < ${inputPath}`;
            }

            exec(command, (runError, runStdout, runStderr) => {
                if (runError || runStderr) {
                    return reject(`Execution Error: ${runError || runStderr}`);
                }
                resolve(runStdout);
            });
        });
    });
};

module.exports = { executeJava };
