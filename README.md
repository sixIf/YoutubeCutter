# YoutubeCutter
<h1 align="center">
  <img src="https://i.imgur.com/CpEzcSM.png" alt="Youtube Cutter" width="200">
  <br>
  Youtube Cutter
  <br>
  <br>
  <img src="https://i.imgur.com/ZfYsOWA.gif" alt="Youtube Cutter">
</h1>

### About

Yet another Youtube downloader made with vue-electron.<br/>
The tool's specificity is that you can select only part of the video you want to download, and specify wanted the format (audio / video).<br/>


### Features

-   [x] Downloading videos as well as mp3
-   [x] Download specific part of the video in mp3 or mp4
-   [x] Download entire channels and playlists
-   [x] Supported Language: English - French
-   [x] 3 downloads at a time

### Stack

-   [Electron](https://github.com/electron/electron) - Cross platform framework for native platforms
-   [Vue](https://github.com/facebook/react) - UI framework
-   [Sass](https://github.com/sass/sass) - CSS with superpowers
-   [Webpack](https://webpack.js.org/) - A module bundler for JavaScript

## How to Install

Head to the [release page](https://github.com/sixIf/Youtube-downloader/releases) to get the latest version.

## Build locally
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

## Contributing

### Features and Bugs

Suggestions and contributions are always welcome! Please first discuss changes via issue before submitting a pull request.

### Adding missing translations

The list of all English strings can be found in [`en.ts`](./src/i18n/translations/en.ts). If there are translations missing for your language and you'd like to help with the translation, you can add the translated strings to your language's file in [`src/i18n/translations`](./src/i18n/translations) and submit a PR.

### Adding a new language

If the app isn't translated into your language yet and you'd like to help out, you can easily add translations with the following steps:

1. The translation files can be found in [`src/i18n/translations`](./src/i18n/translations). Duplicate the [`en.ts`](./src/i18n/translations/en.ts) file as `[LANG].ts`, where `[LANG]` is the [shortcode of your language](https://electronjs.org/docs/api/locales).
2. In the file you just created, replace the English translations with your own.
3. Import your file in the `messages` object in [`src/i18n/i18n.ts`](./src/i18n/i18n.ts).
4. Add your language shortcode to the `localesToFlag` array in [`src/i18n/i18n.ts`](./src/i18n/i18n.ts).
5. Run the app in your language and make sure that the translations fit into the app (e.g. that they aren't too long for input fields).
6. Submit a PR. Thanks for your help!

## Disclaimer

This program should only be used on non-copyrighted material.
      
  
