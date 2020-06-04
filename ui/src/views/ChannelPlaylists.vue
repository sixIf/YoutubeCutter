<template>
  <div>
    <list-items
      @more-items="fetchMorePlaylists"
      @item-clicked="goToVideos"
      :itemType="itemType"
      :itemList="playlistList"
    />
  </div>
</template>


<script>
import ListItems from "../components/ListItems";
import axios from "axios";
export default {
  name: "channel-playlists",
  components: { ListItems },
  props: {},
  data: () => ({
    playlistList: [],
    nextPageToken: undefined,
    itemType: "playlist"
  }),

  methods: {
    downloadSinglePlaylist(playlist) {},
    fillPlaylistList(apiResponse) {
      apiResponse.forEach(playlist => {
        this.playlistList.push({
          id: playlist.id,
          title: playlist.snippet.title,
          thumbnail: playlist.snippet.thumbnails.high.url
        });
      });
    },
    fetchMorePlaylists() {
      if (nextPageToken) {
        axios
          .get(
            "https://www.googleapis.com/youtube/v3/playlists?part=snippet&order=date&maxResults=25",
            {
              params: {
                channelId: this.channelId,
                key: this.$api_key,
                pageToken: this.nextPageToken
              }
            }
          )
          .then(response => {
            this.fillPlaylistList(response.data.items);
            this.nextPageToken =
              this.nextPageToken == response.data.nextPageToken
                ? null
                : response.data.nextPageToken;
          });
      }
    },

    goToVideos(key) {
      this.$router.push({
        name: "playlist-videos",
        params: {
          id: this.channelId,
          playlistId: key
        }
      });
    }
  },

  computed: {
    channelId() {
      return this.$route.params.id;
    }
  },

  mounted() {
    // Get channel's playlists
    axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet&order=date&maxResults=25",
        {
          params: {
            channelId: this.channelId,
            key: this.$api_key
          }
        }
      )
      .then(response => {
        this.fillPlaylistList(response.data.items);
        this.nextPageToken = response.data.nextPageToken;
      })
      .catch(err => {
        this.$router.push("/");
        console.log(err);
      });
  }
};
</script>
