import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
    en: {
		search: {
			youtubeLink: 'Youtube link',
			addYoutubeLink: 'Add a Youtube link',
			info: 'Added {nb} video | Added {nb} videos',
			error: 'Video not found, please verify your link'
		},
		contextMenu: {
			paste: 'Paste'
		},
		download: {
			textInputLabel: 'Video, Playlist or channel URL',
			folder: 'Download Folder',
			folderHint: 'Choose where to save the download',
			button: 'Download {nb} video | Download {nb} videos'
		},
		error: {
			linkNotFound: 'Link not found'
		},
		videoList: {
			clear: 'Clear the video list',
			edit: 'Edit the video and select specific parts',
			deselect: 'Deselect the video',
			select: 'Select the video to download',
			audio: 'Full audio',
			video: 'Full video',
			slice: '{nb} slice | {nb} slices',
		},
		slice: {
			managerTitle: 'Cut parts of the video',
			addLabel: 'Add a slice',
			add: 'Add',
			cantAdd: 'Can`t create more',
			name: 'Slice name',
			keep: 'Keep the whole video',
			cutFrom: 'Cut from',
			copyTime: 'Copy current youtube video time',
			toTime: 'To',
			duration: 'for a duration of',
			preview: 'Preview slice',
			delete: 'Delete slice'
		},
		format: {
			format: 'Format',
			selectHint: 'Choose the format for the download',
			video: 'Video',
			audio: 'Audio'
		},
		help: {
			title: 'How to use this tool',
			downloadSteps: {
				firstTitle: 'Copy a link',
				firstContent: 'Go to Youtube, copy the link to a video, a playlist or a channel, and paste it in the tool to start !',
				secondTitle: 'Cut the videos',
				secondContent: 'You can add other videos, choose the download format and specific part of the videos to keep.',
				thirdTitle: 'Download',
				thirdContent: 'Choose where to put the downloaded videos, then you can start the download !',
			},
			aboutTitle: 'About',
			aboutContent: 'I made this projet to help people in their need to extract videos from Youtube, it is 100% open source and free to use.<br/><br/>Don’t forget to mention the content’s creators when using part of their videos, and don’t use it for copyrighted material.<br/><br/>If you like this app, feel free to support it by donating !',
			donate: 'Donate'
		},
		queue: {
			title: 'Downloads',
			downloading: 'Downloading',
			waiting: 'Waiting',
			downloaded: 'Downloaded',
			error: 'Failed',
			moveUpTooltip: 'Move up in queue',
			removeQueueTooltip: 'Remove from queue',
			playTooltip: 'Play',
			folderTooltip: 'Open in folder',
			viewErrorTooltip: 'View error',
			retryTooltip: 'Retry download',
			videoDownloaded: 'Downloaded {video}',
			videoError: 'Error downloading {video}'
		}
    },
    fr: {
		search: {
			youtubeLink: 'Lien Youtube',
			addYoutubeLink: 'Ajouter un lien Youtube',
			info: '{nb} vidéo ajoutée | {nb} vidéos ajoutées',
			error: 'Vidéo introuvable, vérifier le lien.'
		},		
		contextMenu: {
			paste: 'Coller'
		},
		download: {
			textInputLabel: 'URL d\'une vidéo, playlist ou chaîne',
			folder: 'Dossier de téléchargement',
			folderHint: 'Choisir où sauvegarder les vidéos à télécharger',
			button: 'Télécharger %{nb} vidéo | Télécharger %{nb} vidéos'
		},
		error: {
			linkNotFound: 'Lien non trouvé'
		},		
		videoList: {
			clear: 'Vider la liste',
			edit: 'Editer la vidéo en sélectionnant des parties',
			deselect: 'Déselectionner la vidéo',
			select: 'Selectionner la vidéo à télécharger',
			audio: 'Audio complet',
			video: 'Vidéo complète',
			slice: '{nb} morceau | {nb} morceaux',			
		},
		slice: {
			managerTitle: 'Couper des parties de la vidéo',
			add: 'Ajouter',
			addLabel: 'Ajouter une partie',
			cantAdd: 'Impossible d\'en créer plus',
			name: 'Nom de la partie',
			keep: 'Garder la vidéo entière',
			cutFrom: 'Coupe de',
			copyTime: 'Copie le temps courant du lecteur youtube',
			toTime: 'à',
			duration: 'pour une durée de',
			preview: 'Prévisualiser la partie',
			delete: 'Supprimer la partie'
		},
		format: {
			format: 'Format',
			selectHint: 'Choix du format à télécharger',
			video: 'Vidéo',
			audio: 'Audio'
		},
		help: {
			title: 'Comment ça marche ?',
			downloadSteps: {
				firstTitle: 'Copie un lien',
				firstContent: 'Va sur Youtube, copie le lien vers une vidéo, une playlist ou une chaîne, puis colle le pour commencer !',
				secondTitle: 'Coupe les vidéos',
				secondContent: 'Tu peux rajouter des vidéos, choisir le format de téléchargement et couper des parties de vidéos.',
				thirdTitle: 'Télécharge',
				thirdContent: 'Choisi dans quel dossier sauvegarder les vidéos et lance le téléchargement !',
			},
			aboutTitle: 'À propos',
			aboutContent: 'J\'ai fait ce projet pour aider a extraire des vidéos sur Youtube, de manière gratuite et Open-source.<br/><br/>N\'oubliez pas de mentionner les créateurs de contenus lors de votre utilisation et de ne télécharger que des vidéos libres de droits.<br/><br/>Si vous aimez cette application, n\'hésitez pas à faire un don !',
			donate: 'Donation'
		},	
		queue: {
			title: 'Téléchargements',
			downloading: 'En cours de téléchargement',
			waiting: 'En attente',
			downloaded: 'Téléchargés',
			error: 'Echecs de téléchargements',
			moveUpTooltip: 'Mettre en tête de la file d\'attente',
			removeQueueTooltip: 'Retire de la file d\'attente',
			playTooltip: 'Lecture',
			folderTooltip: 'Ouvre le dossier',
			viewErrorTooltip: 'Voir les erreurs',
			retryTooltip: 'Retenter le téléchargement',
			videoDownloaded: 'Téléchargé {video}',
			videoError: 'Erreur de téléchargement {video}'						
		}					
    }
}

export type localeType = keyof typeof messages;

export const localesToFlag = {
	en: 'gb',
	fr: 'fr'
}

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'en', // set locale
    messages, // set locale messages
})


export default i18n;