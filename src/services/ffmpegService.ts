import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg, { slice } from 'ffmpeg-static';

ffmpeg.setFfmpegPath(
    // Ffmpeg.exe is unpacked into app.asar.unpacked
    pathToFfmpeg.toString().replace("app.asar", "app.asar.unpacked")
);

export interface IFfmpegService {
    sliceAudio(audioPath: string): void;
    sliceVideo(videoPath: string): void;
    mergeAudioVideo(audioPath: string, videoPath: string, outputPath: string): Promise<string>;
}

export class FfmpegService implements IFfmpegService {
    mergeAudioVideo(audioPath: string, videoPath: string, outputPath: string): Promise<string> {
        return new Promise ( (resolve, reject) => {
            ffmpeg()
                .input(audioPath)
                .audioCodec('copy')
                .input(videoPath)
                .videoCodec('copy')
                .save(outputPath)
                .on('error', (err) => reject(err))
                .on('end', () => resolve(`\nFinished downloading, saved to ${outputPath}`));
        })
    }
    sliceAudio(audioPath: string): void {
        throw new Error("Method not implemented.");
    }
    sliceVideo(videoPath: string): void {
        throw new Error("Method not implemented.");
    }

}