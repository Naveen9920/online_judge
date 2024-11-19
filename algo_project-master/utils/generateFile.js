const fs = require('fs');
const path = require('path');

const dirCodes = path.join(__dirname, 'codes');

// Create the 'codes' directory if it doesn't exist
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

// Function to generate a Java file from the provided code
const generateFile = async (content) => {
    const classNameMatch = content.match(/public class (\w+)/); // Regex to find public class name
    const className = classNameMatch ? classNameMatch[1] : 'Main'; // Default to 'Main' if not found
    const filename = `${className}.java`; // Use the class name for the filename
    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, content); // Write the file content
    return filePath; // Return the path of the generated file
};

module.exports = {
    generateFile,
};
