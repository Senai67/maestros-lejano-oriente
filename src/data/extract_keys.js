const fs = require('fs');
const path = require('path');
const targetFile = 'c:/Users/José Manuel/Desktop/Antigravity_Docs/MAESTROS_LEJANO_ORIENTE/src/data/libros.js';
const content = fs.readFileSync(targetFile, 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.match(/^\s+".*": \[/)) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
