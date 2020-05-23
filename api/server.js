// const http = require('http');

// const hostname = '0.0.0.0';
// const port = 8081;

// const server = http.createServer((req, res) => {
//   const fs = require('fs');
//   const ytdl = require('ytdl-core');
//   // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
//   // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
//   // TypeScript: import ytdl = require('ytdl-core'); with neither of the above

//   ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
//     .pipe(fs.createWriteStream('video.flv'));
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });



const express = require('express')
const app = express()
const port = 8081
const morgan = require('morgan')
const fs = require('fs')
const ytdl = require('ytdl-core');
const path = require('path')
const cors = require('cors')
const AdmZip = require('adm-zip');


if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

// create a write stream for logs
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/download-video', function (req, res) {
  ytdl(`http://www.youtube.com/watch?v=${req.query.videoId}`)
    .pipe(fs.createWriteStream(`${req.query.videoTitle}.flv`));
  res.sendFile(__dirname + `/${req.query.videoTitle}.flv`)
  // var videoZip = new AdmZip();
  // videoZip.addLocalFile(`${req.query.videoTitle}.flv`);
  // var willSendthis = videoZip.toBuffer();
  // console.log(willSendthis);
  // res.download(`${req.query.videoTitle}.flv`, function (err) {
  //   if (err) {
  //     console.log('api get file err ', err);
  //   } else {
  //     // decrement a download credit, etc.
  //   }
  // })
})
// app.get('')

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))