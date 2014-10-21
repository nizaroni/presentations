var stream = require('stream');

var readableStream = new stream.Readable();
readableStream.push('pew ');
readableStream.push('pow\n');
readableStream.push(null);

readableStream.pipe(process.stdout);
