var fs = require('fs');

fs.createReadStream(__dirname + '/sentences.csv')
    .pipe(process.stdout)
;
