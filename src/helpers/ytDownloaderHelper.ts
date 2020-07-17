import readline from 'readline';
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { ItemStruct } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
import { BrowserWindow } from 'electron';


export default function downloadItems(items: Array<ItemStruct>, audioOnly: boolean, output: string, win: BrowserWindow | null) {
  // Notify renderer to display the donwload icon
  if (win)
    win.webContents.send('download-started', items.length)
  items.forEach((videoToFetch) => {
    console.log(pathToFfmpeg);
    const url = `https://www.youtube.com/watch?v=${videoToFetch.id}`;
    const audioOutputMp4 = path.resolve(output, sanitize(`${videoToFetch.title}.mp4`));
    const audioOutputMp3 = path.resolve(output, sanitize(`${videoToFetch.title}.mp3`));
    const mainOutput = path.resolve(output, sanitize(`${videoToFetch.title}.mp4`));

    const onProgress = (chunkLength: number, downloaded: number, total: number, videoDownloading: ItemStruct) => {
      const percent = downloaded / total;
      readline.cursorTo(process.stdout, 0);
      // console.log(`${(percent * 100).toFixed(2)}% downloaded `)
      // console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`)
      // process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`);
      // process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
      if (win)
        win.webContents.send('download-progress', { progress: `${(percent * 100).toFixed(2)}% downloaded`, video: videoDownloading })
    };

    console.log(fs.readdirSync(__dirname))
    console.log('downloading audio track');

    ffmpeg.setFfmpegPath(
      // Ffmpeg.exe is unpacked into app.asar.unpacked
      pathToFfmpeg.toString().replace("app.asar", "app.asar.unpacked")
    );

    ytdl(url, {
      filter: format => format.container === 'mp4' && !format.qualityLabel,
    }).on('error', console.error)
      .on('progress', (chunkLength: number, downloaded: number, total: number) => {
        onProgress(chunkLength, downloaded, total, videoToFetch)
      })

      // Write audio to file since ffmpeg supports only one input stream.
      .pipe(fs.createWriteStream(audioOutputMp4))
      .on('finish', () => {
        console.log('audio track downloaded')
        if (!audioOnly) {
          // Download and merge video
          console.log('\ndownloading video');
          const video = ytdl(url, {
            filter: format => format.container === 'mp4' && !format.audioBitrate,
          })
          video.on('progress', (chunkLength: number, downloaded: number, total: number) => {
            onProgress(chunkLength, downloaded, total, videoToFetch)
          });
          ffmpeg()
            .input(video)
            .videoCodec('copy')
            .input(audioOutputMp4)
            .audioCodec('copy')
            .save(mainOutput)
            .on('error', console.error)
            .on('end', () => {
              fs.unlink(audioOutputMp4, err => {
                if (err) console.error(err);
                else console.log(`\nfinished downloading, saved to ${mainOutput}`);
                if (win)
                  win.webContents.send('item-downloaded', videoToFetch.id)
              });
            });
        }
        else {
          // Convert audio to mp3
          ffmpeg()
            .input(audioOutputMp4)
            .audioCodec('libmp3lame')
            .save(audioOutputMp3)
            .on('error', console.error)
            .on('end', () => {
              fs.unlink(audioOutputMp4, err => {
                if (err) console.error(err);
                else console.log(`\nfinished converting audio to mp3, saved to ${audioOutputMp3}`);
                if (win)
                  win.webContents.send('item-downloaded', videoToFetch.id)
              });
            });
        }
      });
  });
}
