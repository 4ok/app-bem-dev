const path = require('path');
const fs = require('fs');

const argv = process.argv;
const source = argv[2];
const varsFile = path.resolve(argv[3]);

const vars = require(varsFile);
const fileEncoding = 'utf8';
let content = fs.readFileSync(source, fileEncoding);

Object
    .keys(vars)
    .forEach(key => {
        const regExp = new RegExp('<' + key + '>', 'g');

        content = content.replace(regExp, vars[key]);
    });

console.log(content);
