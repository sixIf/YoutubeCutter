export const videoContainer = ["ytd-video-renderer", "ytd-grid-video-renderer", "ytd-rich-item-renderer"]; 
export const playlistContainer = ["ytd-playlist-renderer", "ytd-grid-playlist-renderer"]; 
export const channelContainer = ["ytd-channel-renderer", "ytd-grid-channel-renderer"]; 

export interface clickInfo {
    videoID: string | null;
    channelID: string | null;
    playlistID: string | null;
}
