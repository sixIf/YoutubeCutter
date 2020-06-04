let axios = require('axios');

exports.test = () => {
  console.log('test')
}

exports.fetchVideoInPlaylist = (apiKey, playlistId, pageToken) => {
  console.log('fetchVideoInPlaylist')
  axios
    .get(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=25",
      {
        params: {
          playlistId: playlistId,
          key: api_key,
          pageToken: pageToken
        }
      }
    )
    .then(response => {
      // this.fillVideoList(response.data.items);
      // this.nextPageToken = response.data.nextPageToken;
    });
}

exports.findChannelById = (apiKey, channelId) => {
  console.log('findChannelById')
  return axios
    .get(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
      {
        params: {
          id: channelId,
          key: apiKey
        }
      }
    )
}