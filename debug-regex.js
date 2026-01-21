
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve('PRD.md'), 'utf8');

console.log('--- File Dump (first 500 chars) ---');
console.log(JSON.stringify(content.slice(0, 500)));

const regex = /## (.*?)\s+### Tasks:\s+((?:- \[( |x)\] .+\n)+)/g;
const match = regex.exec(content);

if (match) {
    console.log('\n✅ Regex Matched!');
    console.log('Section:', match[1]);
    console.log('Block:', match[2]);
} else {
    console.log('\n❌ Regex DID NOT match');
    console.log('Trying to find "Authentication" header...');
    const idx = content.indexOf('## Authentication');
    if (idx !== -1) {
        console.log('Found "Authentication" at index', idx);
        console.log('Next 50 chars:', JSON.stringify(content.slice(idx, idx + 50)));
    }
}
