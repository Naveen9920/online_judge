const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateCFile = async (content) => {
    const jobID = uuid();
    const filename = `${jobID}.c`;
    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateCFile,
};
