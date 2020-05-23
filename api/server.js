const http = require('http');

const hostname = '0.0.0.0';
const port = 8081;

const server = http.createServer((req, res) => {
  const fs = require('fs');
  const ytdl = require('ytdl-core');
  // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
  // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
  // TypeScript: import ytdl = require('ytdl-core'); with neither of the above

  ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
    .pipe(fs.createWriteStream('video.flv'));
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});