var append = require('appendage');
var split = require('split');
var fs = require('fs');

fs.createReadStream(__dirname + '/sentences.csv')
    .pipe(split(','))
    .pipe(append({ before: ' ' }))
    .pipe(process.stdout)
;
