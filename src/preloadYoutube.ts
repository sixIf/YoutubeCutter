import "reflect-metadata"
import { ipcRenderer } from 'electron'
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { videoContainer, playlistContainer, channelContainer } from "./config/litterals/youtube";

const loggerService = ApplicationContainer.resolve(LoggerService);

/** 
 * Get the link from the right-clicked element
**/
window.addEventListener('contextmenu', (e: MouseEvent) => {
	e.preventDefault()
	const currentPath = window.location.pathname;

	// if (currentPath.includes("/channel/") || currentPath.includes("/c/")) {

	// } else if (currentPath.includes("?v")) {

	// } else if (currentPath.includes("?list=")) {

	// }

	/**
	 * playlist view : https://www.youtube.com/user/Kokokokokokokokokoko/playlists
	 * 		playlist : ytd-grid-playlist-renderer
	 * playlist detail : https://www.youtube.com/playlist?list=PLYH8WvNV1YElEavXrU1B5-nMaEkQJFd8inI
	 * videoList on channel : https://www.youtube.com/user/Kokokokokokokokokoko/videos
	 * 		video : ytd-grid-video-renderer
	 * channel hompage : channel https://www.youtube.com/channel/UCwbV8cTRaaa4yBgFdfa_BXV2OA
	 */		
	// switch (window.location) {

	// }

	try {
		const possibleContainerTag = `${videoContainer.join(', ')}, ${playlistContainer.join(', ')}, ${channelContainer.join(', ')}`;
		let clickedElement = e.target as HTMLElement;
		let containerElement = clickedElement.closest(possibleContainerTag);
	
		console.log(possibleContainerTag);
		if (containerElement) {
			console.log(containerElement.tagName);
			let isPlaylist = playlistContainer.includes(containerElement.tagName.toLowerCase());
			let channelID = null;

			const linksInContainer = containerElement.getElementsByTagName('A');

			// href="/watch?v=ktEXdaMXNqs"
			let itemID = linksInContainer.namedItem("thumbnail") ? 
				linksInContainer.namedItem("thumbnail")!.getAttribute('href') :
				null;
				
			if(itemID) itemID = itemID!.slice(itemID!.lastIndexOf('=') + 1);
			
			if (channelContainer.includes(containerElement.tagName.toLowerCase())) {
				// href="/channel/ktEXdaMXNqs"
				const channelHref = linksInContainer.namedItem("channel-info") ? 
					linksInContainer.namedItem("channel-info")!.getAttribute('href') :
					null;
				channelID = channelHref!.slice(channelHref!.lastIndexOf('/'))
			}

			
			ipcRenderer.send('open-context-menu', {
				videoID: isPlaylist ? null : itemID,
				channelID: channelID,
				playlistID: isPlaylist ? itemID : null 
			});
		} else {
			throw new Error("Unknown item clicked");
		}
	} catch (err) {
		loggerService.error(err);
	}

  
  }, false)

  /**
   * Prevent opening other website
   * TODO: prevent opening of new tab / window
   */
window.addEventListener("load", () => {
	if (window.location.hostname != "www.youtube.com")
		window.location.href = "https://www.youtube.com"
}); 