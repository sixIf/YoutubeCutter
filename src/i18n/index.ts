import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
    en: {
		contextMenu: {
			paste: 'Paste'
		},
		download: {
			textInputLabel: 'Video, Playlist or channel URL',
			folder: 'Download Folder',
			folderHint: 'Choose where to save the download',
			button: 'Download'
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
			add: 'Add a slice',
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
    },
    fr: {
		contextMenu: {
			paste: 'Coller'
		},
		download: {
			textInputLabel: 'URL d\'une vidéo, playlist ou chaîne',
			folder: 'Dossier de téléchargement',
			folderHint: 'Choisir où sauvegarder les vidéos à télécharger',
			button: 'Télécharger'
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
			add: 'Ajouter une partie',
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