var fs = require('fs');

var fileStream = fs.createReadStream(__dirname + '/sentences.csv');
fileStream.on('readable', function () {
    console.log('Chunk:', fileStream.read());
});
