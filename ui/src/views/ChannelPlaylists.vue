<template>
  <div>
    <v-container class="list-playlist-container" fluid>
      <v-row dense>
        <p v-if="!playlistList">No playlists found</p>
        <v-col v-for="playlist in playlistList" :key="playlist.id" cols="2">
          <v-card @click="true">
            <v-img
              :src="playlist.snippet.thumbnails.high.url"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="playlist.snippet.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>
              <download-modal :playlistId="playlist.key">
                <!-- <v-btn icon @click="downloadSinglePlaylist(playlist)"> -->
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
              </download-modal>
            </v-card-actions>
          </v-card>
          <!--<v-card class="elevation-12">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click.prevent="changePage('next')">Next</v-btn>
              <v-btn color="secondary" @click.prevent="changePage('prev')">Previous</v-btn>
              <v-btn color="primary"  @click.prevent="findPlaylists">Search</v-btn>
            </v-card-actions>
          </v-card>-->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import FiltersToolbar from "../components/FiltersToolbar";
import DownloadModal from "../components/DownloadModal";
import axios from "axios";
export default {
  name: "channel-playlists",
  components: { FiltersToolbar, DownloadModal },
  props: {},
  data: () => ({
    playlistList: undefined
  }),

  methods: {
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          console.log("Montre plus");
          // this.playlistList.push({
          // });
        }
      };
    },
    changePage(direction) {
      var pageToken =
        direction == "next"
          ? this.playlistList.data.nextPageToken
          : this.playlistList.data.prevPageToken;
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=25",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key,
              pageToken: pageToken
            }
          }
        )
        .then(response => {
          this.playlistList = response;
        });
    },
    downloadSinglePlaylist(playlist) {
      axios
        .get("/download-playlist", {
          params: {
            playlistId: playlist.id.playlistId,
            playlistTitle: playlist.snippet.title,
            channelName: playlist.snippet.channelTitle
          }
          // responseType: "blob"
        })
        .then(response => {
          // console.log(response.headers.get("content-type"));
          console.log(response);

          // console.log(response.headers.get("content-type"));
          // console.log(response);

          // var blob = new Blob([response.body], {
          //   type: response.headers.get("content-type")
          // });

          // var link = document.createElement("a");
          // link.href = window.URL.createObjectURL(blob);
          // link.download = item.filename_version;
          // link.click();
        })
        .catch(error => {
          console.log("bug");
          console.log(error);
          if (!error.response) {
            // network error
            this.errorStatus = "Error: Network Error";
          } else {
            this.errorStatus = error.response.data.message;
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
    // Init scroll
    this.scroll();

    // Get channel's playlists
    axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet&order=date&maxResults=10",
        {
          params: {
            channelId: this.channelId,
            key: this.$api_key
          }
        }
      )
      .then(response => {
        this.playlistList = response.data.items;
      })
      .catch(err => {
        this.$router.push("/");
        console.log(err);
      });
  }
};
</script>
<!--
<style lang="stylus">
#app 
  background-color: black !important
</style>-->