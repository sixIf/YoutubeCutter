<template>
  <div>
    <filters-toolbar searchLabel="Search specific video"></filters-toolbar>
    <v-container class="list-video-container" fluid>
      <v-row dense>
        <p v-if="!videoList">No videos found</p>
        <v-col v-for="video in videoList" :key="video.id.videoId" cols="2">
          <v-card>
            <v-img
              :src="video.snippet.thumbnails.high.url"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="video.snippet.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>
              <download-modal :videoId="video.key">
                <!-- <v-btn icon @click="downloadSingleVideo(video)"> -->
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
              <v-btn color="primary"  @click.prevent="findVideos">Search</v-btn>
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
  name: "channel-videos",
  components: { FiltersToolbar, DownloadModal },
  props: {
    //videoList: undefined
  },
  data: () => ({
    /* TODO Put as props and undefined */
    channelId: "UChKMRHxLETrj_5JjiqExD1w",
    channelThumbnail:
      "https://yt3.ggpht.com/-kuwqOm6qy04/AAAAAAAAAAI/AAAAAAAAAAA/knXSxLuA1mU/s800-c-k-no-mo-rj-c0xffffff/photo.jpg",
    channelTitle: "Kemar",
    /* TODO put undefined */
    videoList: [
      {
        kind: "youtube#searchResult",
        etag: "NlPCNF81W5grhvvXHvb5AXqDbHs",
        id: { kind: "youtube#video", videoId: "DCyx9MdbUvc" },
        snippet: {
          publishedAt: "2020-05-19T17:55:35Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Dethemiros",
          description: "Animation by Roman Saoulski @Romoushka sur Instagram.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/DCyx9MdbUvc/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/DCyx9MdbUvc/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/DCyx9MdbUvc/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-05-19T17:55:35Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "3mbWGfg0RFSZYSJ4A_Xx5UVryDs",
        id: { kind: "youtube#video", videoId: "vxLr4ecuPuc" },
        snippet: {
          publishedAt: "2020-05-02T15:31:16Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title:
            "Les Recettes À Joaquim Bailey - La Monster Salad Poke Bowl Salmon Protein +",
          description:
            "Découvrez dans une exclusivité quasi totale, la recette des champions. Offerte par Joaquim Bailey, le coach diététicien référence des célébrités.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/vxLr4ecuPuc/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/vxLr4ecuPuc/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/vxLr4ecuPuc/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-05-02T15:31:16Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "wAVuFE2O96plFm-MRDMLnlik_jU",
        id: { kind: "youtube#video", videoId: "RQgiDeQwO5U" },
        snippet: {
          publishedAt: "2020-05-01T16:50:27Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Les Recettes À Éric - Les Aubergines Au Fromage 2 Chèvre",
          description:
            "Une nouvelle recette Veggie complètement sympa revisité par le chef Éric !",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/RQgiDeQwO5U/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/RQgiDeQwO5U/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/RQgiDeQwO5U/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-05-01T16:50:27Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "TLl-rYk00tpi_gB-YA9thN3msjw",
        id: { kind: "youtube#video", videoId: "gRPtJHJyFeo" },
        snippet: {
          publishedAt: "2020-04-29T18:17:38Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Les Recettes À Éric - Le Saucisse Lentilles",
          description:
            "Le maitre cuisinier Éric vous présente sa recette revisité de la célèbre saucisse lentille ! Crédit Audio : Modern Freaks - Fucked.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/gRPtJHJyFeo/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/gRPtJHJyFeo/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/gRPtJHJyFeo/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-04-29T18:17:38Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "GD3i8Ayh4Yz6ysZWWamgW8rSguQ",
        id: { kind: "youtube#video", videoId: "F6mHE5Wf1ts" },
        snippet: {
          publishedAt: "2020-04-28T19:14:27Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Les Recettes À Eric - Les Pâtes Carbo",
          description:
            "Le maitre cuisinier Éric vous présente sa recette revisité de la célèbre pâte carbo. Crédit Audio : Modern Freaks - Fucked.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/F6mHE5Wf1ts/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/F6mHE5Wf1ts/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/F6mHE5Wf1ts/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-04-28T19:14:27Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "AdaUrFLbmXzTnbEPcw_m7Xud5DM",
        id: { kind: "youtube#video", videoId: "5mMlJPdx8rw" },
        snippet: {
          publishedAt: "2020-04-28T10:22:11Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Pong Master 3.0. Démo",
          description:
            "Présentation du nouveau jeu développé par les studios Blast Fame. Célèbre enseigne et multinational dédié au sport ludique et au multimédia.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/5mMlJPdx8rw/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/5mMlJPdx8rw/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/5mMlJPdx8rw/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-04-28T10:22:11Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "tEakeB1SotbyP1ZEd1Rc4ABvEC4",
        id: { kind: "youtube#video", videoId: "f8WQ2d5Iy6M" },
        snippet: {
          publishedAt: "2020-04-27T15:55:35Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Gefickt Kontrollieren - POP EARTH",
          description:
            "Discover the Space Odyssey Album of Gefickt Kontrollieren. Remastered. Track list : 0:00 - Signal Of The Big Black Hole 0:31 - Arena 4:06 - Be My Boy #BMB ...",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/f8WQ2d5Iy6M/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/f8WQ2d5Iy6M/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/f8WQ2d5Iy6M/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-04-27T15:55:35Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "HltkPR5gWjR5RwvSmxDmpxxY-fQ",
        id: { kind: "youtube#video", videoId: "FcXYbJL7h1A" },
        snippet: {
          publishedAt: "2020-04-25T12:05:12Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Ultimate Stricker Pro 3D Démo",
          description: "En exclusivité, une démo du jeu ultra attendu en 2020.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/FcXYbJL7h1A/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/FcXYbJL7h1A/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/FcXYbJL7h1A/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-04-25T12:05:12Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "blZCP16XqG5MNw5XFGNfkfcVYY8",
        id: { kind: "youtube#video", videoId: "24kt5aIflQs" },
        snippet: {
          publishedAt: "2020-02-28T19:00:30Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Dormir en 3 min bis",
          description: "Laissez-vous porter par les mots.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/24kt5aIflQs/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/24kt5aIflQs/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/24kt5aIflQs/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-02-28T19:00:30Z"
        }
      },
      {
        kind: "youtube#searchResult",
        etag: "7bj3kSVnSsgcf2Df8V9TBhYTfdQ",
        id: { kind: "youtube#video", videoId: "hkGaB7HIdw8" },
        snippet: {
          publishedAt: "2020-02-22T03:21:10Z",
          channelId: "UChKMRHxLETrj_5JjiqExD1w",
          title: "Pour dormir en 3 min",
          description:
            "Le beat de fin effectué par : https://soundcloud.com/kaf_soundz/beat-nebuleuse-kafsoundz https://twitter.com/kaf_soundz ...",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/hkGaB7HIdw8/default.jpg",
              width: 120,
              height: 90
            },
            medium: {
              url: "https://i.ytimg.com/vi/hkGaB7HIdw8/mqdefault.jpg",
              width: 320,
              height: 180
            },
            high: {
              url: "https://i.ytimg.com/vi/hkGaB7HIdw8/hqdefault.jpg",
              width: 480,
              height: 360
            }
          },
          channelTitle: "Kemar",
          liveBroadcastContent: "none",
          publishTime: "2020-02-22T03:21:10Z"
        }
      }
    ]
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
          this.videoList.push({
            kind: "youtube#searchResult",
            etag: "NlPCNF81W5grhvvXHvb5AXqDbHs",
            id: { kind: "youtube#video", videoId: "DCyx9MdbUve" },
            snippet: {
              publishedAt: "2020-05-19T17:55:35Z",
              channelId: "UChKMRHxLETrj_5JjiqExD1w",
              title: "Dethemiros",
              description:
                "Animation by Roman Saoulski @Romoushka sur Instagram.",
              thumbnails: {
                default: {
                  url: "https://i.ytimg.com/vi/DCyx9MdbUvc/default.jpg",
                  width: 120,
                  height: 90
                },
                medium: {
                  url: "https://i.ytimg.com/vi/DCyx9MdbUvc/mqdefault.jpg",
                  width: 320,
                  height: 180
                },
                high: {
                  url: "https://i.ytimg.com/vi/DCyx9MdbUvc/hqdefault.jpg",
                  width: 480,
                  height: 360
                }
              },
              channelTitle: "Kemar",
              liveBroadcastContent: "none",
              publishTime: "2020-05-19T17:55:35Z"
            }
          });
        }
      };
    },
    changePage(direction) {
      var pageToken =
        direction == "next"
          ? this.videoList.data.nextPageToken
          : this.videoList.data.prevPageToken;
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
          this.videoList = response;
        });
    },
    downloadSingleVideo(video) {
      axios
        .get("/download-video", {
          params: {
            videoId: video.id.videoId,
            videoTitle: video.snippet.title,
            channelName: video.snippet.channelTitle
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
    },
    findVideos() {
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=25",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key
            }
          }
        )
        .then(response => {
          this.videoList = response;
        });
    }
  },

  mounted() {
    // TODO uncomment
    //   axios
    //     .get(
    //       "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=10",
    //       {
    //         params: {
    //           channelId: this.channelId,
    //           key: this.$api_key
    //         }
    //       }
    //     )
    //     .then(response => {
    //       this.videoList = response.data.items;
    //     })
    //     .catch(err => {
    //       this.$router.push("/");
    //       console.log(err);
    //     });
    // Send channel info to dashbord layout
    this.$parent.$emit(
      "channel-infos",
      this.channelId,
      this.channelTitle,
      this.channelThumbnail
    );

    // Init scroll
    this.scroll();
  }
};
</script>
<!--
<style lang="stylus">
#app 
  background-color: black !important
</style>-->