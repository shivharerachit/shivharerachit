const axios = require('axios');

async function updateSpotifyStatus() {
  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;

    const nowPlaying = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });

    if (nowPlaying.data && nowPlaying.data.item) {
      const track = nowPlaying.data.item;
      console.log(`Now playing: ${track.name} by ${track.artists[0].name}`);
      return {
        track: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error updating Spotify status:', error.message);
    return null;
  }
}

updateSpotifyStatus();
