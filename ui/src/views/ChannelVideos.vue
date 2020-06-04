<template>
  <div>
    <filters-toolbar searchLabel="Search specific video" v-on:search-keyword="findVideoByKeyword" />
    <list-items @more-items="fetchMoreVideos" :itemType="itemType" :itemList="videoList" />
  </div>
</template>


<script>
import FiltersToolbar from "../components/FiltersToolbar";
import ListItems from "../components/ListItems";
import axios from "axios";
export default {
  name: "channel-videos",
  components: { FiltersToolbar, ListItems },
  props: {},
  data: () => ({
    nextPageToken: undefined,
    mainPlaylistId: undefined,
    /* TODO protect your credits*/
    videoList: [],
    itemType: "video",
    videoDemo: [
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
    fetchMoreVideos() {
      if (this.nextPageToken) {
        axios
          .get(
            "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=25",
            {
              params: {
                playlistId: this.mainPlaylistId,
                key: this.$api_key,
                pageToken: this.nextPageToken
              }
            }
          )
          .then(response => {
            this.fillVideoList(response.data.items);
            this.nextPageToken =
              this.nextPageToken == response.data.nextPageToken
                ? null
                : response.data.nextPageToken;
          });
      }
    },
    findVideoByKeyword(keyword) {
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=10",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key,
              type: "video",
              q: keyword
            }
          }
        )
        .then(response => {
          this.fillVideoList(response.data.items);
        })
        .catch(err => {
          this.$router.push("/");
          console.log(err);
        });
    },
    fillVideoList(apiResponse) {
      apiResponse.forEach(video => {
        this.videoList.push({
          id: video.snippet.resourceId.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url
        });
      });
    }
  },

  computed: {
    channelId() {
      return this.$route.params.id;
    }
  },

  mounted() {
    // TODO tout doux
    // this.fillVideoList(this.videoDemo);
    // Get channel's videos
    axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&part=contentDetails&maxResults=1",
        {
          params: {
            id: this.channelId,
            key: this.$api_key
          }
        }
      )
      .then(response => {
        // Get videos from channel's playlist "uploaded videos"
        this.mainPlaylistId =
          response.data.items[0].contentDetails.relatedPlaylists.uploads;
        axios
          .get(
            "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=25",
            {
              params: {
                playlistId: this.mainPlaylistId,
                key: this.$api_key
              }
            }
          )
          .then(response => {
            this.fillVideoList(response.data.items);
            this.nextPageToken = response.data.nextPageToken;
          });
      });
  }
};
</script>