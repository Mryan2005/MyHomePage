const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'src', 'assets', 'update-time.json');

const data = {
    lastUpdated: new Date().toISOString()
};

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`update-time.json generated: ${data.lastUpdated}`);
