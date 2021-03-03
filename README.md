# YoutubeCutter
<h1 align="center">
  <img src="https://i.imgur.com/CpEzcSM.png" alt="Youtube Cutter" width="200">
  <br>
  Youtube Cutter
  <br>
  <br>
  <img src="https://i.imgur.com/ZfYsOWA.gifv" alt="Youtube Cutter">
</h1>

### About

Yet another Youtube downloader made with vue-electron.<br/>
The tool's specificity is that you can select only part of the video you want to download, and specify wanted the format (audio / video).<br/>


### Features

-   [x] Downloading videos as well as mp3
-   [x] Download specific part of the video in mp3 or mp4
-   [x] Download entire channels and playlists
-   [x] Multiple downloads at a time
-   [x] Works on Windows


### Stack

-   [Electron](https://github.com/electron/electron) - Cross platform framework for native platforms
-   [Vue](https://github.com/facebook/react) - UI framework
-   [Sass](https://github.com/sass/sass) - CSS with superpowers
-   [Webpack](https://webpack.js.org/) - A module bundler for JavaScript

## Setup locally
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Download ffmpeg.exe
[https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)<br/>
You have to put ffmpeg executable inside ./dist_electron in order to handle sound manipulation.

## Disclaimer

This program should only be used on non-copyrighted material.
      
  
