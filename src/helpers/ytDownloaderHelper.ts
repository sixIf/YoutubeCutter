// Install fluent-ffmpeg before running this!
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { ItemStruct } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
// ffmpeg.setFfmpegPath(pathToFfmpeg);


export default function downloadItems(items: Array<ItemStruct>, audioOnly: boolean, output: string) {
  items.forEach((video) => {

    console.log(pathToFfmpeg);
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    const audioOutput = path.resolve(output, sanitize(`${video.title}.mp4`));
    const mainOutput = path.resolve(output, sanitize(`${video.title}.mp4`));

    const onProgress = (chunkLength: number, downloaded: number, total: number) => {
      const percent = downloaded / total;
      readline.cursorTo(process.stdout, 0);
      console.log(`${(percent * 100).toFixed(2)}% downloaded `)
      console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`)
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
    };

    // const ffmpegPath = ((ffmpeg.path) ? path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked'), require.resolve('ffmpeg-static'), ffmpeg.path) : false);

    console.log(fs.readdirSync(__dirname))
    console.log('downloading audio track');

    ffmpeg.setFfmpegPath(
      // Ffmpeg.exe is unpacked into app.asar.unpacked
      pathToFfmpeg.toString().replace("app.asar", "app.asar.unpacked")
    );

    ytdl(url, {
      filter: format => format.container === 'mp4' && !format.qualityLabel,
    }).on('error', console.error)
      .on('progress', onProgress)

      // Write audio to file since ffmpeg supports only one input stream.
      .pipe(fs.createWriteStream(audioOutput))
      .on('finish', () => {
        console.log('audio track downloaded')
        if (!audioOnly) {
          console.log('\ndownloading video');
          const video = ytdl(url, {
            filter: format => format.container === 'mp4' && !format.audioBitrate,
          })
          video.on('progress', onProgress);
          ffmpeg()
            .input(video)
            .videoCodec('copy')
            .input(audioOutput)
            .audioCodec('copy')
            .save(mainOutput)
            .on('error', console.error)
            .on('end', () => {
              fs.unlink(audioOutput, err => {
                if (err) console.error(err);
                else console.log(`\nfinished downloading, saved to ${mainOutput}`);
              });
            });
        }
      });
  });
}
