export const HelpItems: Array<IHelpItems> = [
    {
        title: 'What can I do with this app ?',
        message: 'Download videos/playlists from a Youtube channel.'
    },
    {
        title: 'What is an API Key ?',
        message: 'To use this app, you will need an API Key. You only need a Google Account.</br>Follow this link to get a step by step explanation: ',
        link: 'https://developers.google.com/youtube/v3/getting-started'
    },
    {
        title: 'Can I download my own playlists ?',
        message: 'Of course, to download your own playlists, set them to public first.</br>Plus you have to publish a video to youtube in your channel in order to find it.'
    },
]

export interface IHelpItems {
    title: string;
    message: string;
    link?: string;
}