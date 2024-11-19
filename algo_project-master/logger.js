// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'userAccess.log');

const logUserAccess = (action, email, startTime, endTime) => {
    const logEntry = `
Action: ${action}
Email: ${email}
Start Time: ${startTime}
End Time: ${endTime}
Duration: ${(endTime - startTime)} ms
-----------------------------------
`;
    
    fs.appendFileSync(logFilePath, logEntry, 'utf8', (err) => {
        try {
            fs.appendFileSync(logFilePath, logEntry, 'utf8');
            console.log('Log entry written successfully.');
        } catch (err) {
            console.error('Error writing to log file:', err);
        }
    });
};

module.exports = { logUserAccess };
