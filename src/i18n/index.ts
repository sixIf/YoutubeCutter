import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
    en: {
		input: {
			youtubeLink: 'Youtube link',
			addYoutubeLink: 'Add a Youtube link',
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
			select: 'Select the video to download'
		},
		slice: {
			managerTitle: 'Cut parts of the video',
			addLabel: 'Add',
			add: 'Add a slice',
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
			title: 'Using this tool is easy as',
			downloadSteps: {
				firstTitle: 'Copy link',
				firstContent: 'Paste in the above form the link of the video, playlist or the channel',
				secondTitle: 'Cut the videos',
				secondContent: 'Select the part of the videos',
				thirdTitle: 'Download',
				thirdContent: 'Enjoy',
			}
		},
    },
    fr: {
		input: {
			youtubeLink: 'Lien Youtube',
			addYoutubeLink: 'Ajouter un lien Youtube',
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
			select: 'Selectionner la vidéo à télécharger'
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
			title: 'Utiliser cet outil est aussi simple que',
			downloadSteps: {
				firstTitle: 'Copy link',
				firstContent: 'Paste in the above form the link of the video, playlist or the channel',
				secondTitle: 'Cut the videos',
				secondContent: 'Select the part of the videos',
				thirdTitle: 'Download',
				thirdContent: 'Enjoy',
			}
		},				
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