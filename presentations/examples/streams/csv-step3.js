var split = require('split');
var fs = require('fs');

fs.createReadStream(__dirname + '/sentences.csv')
    .pipe(split(','))
    .pipe(process.stdout)
;
