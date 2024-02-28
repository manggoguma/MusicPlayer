// 엔터키 기능 추가
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});

// 토큰 요청
let token;
const client_id = "027d68ef08f84e8ebbf9e24aa91a52b5";
const client_secret = "6c38e73980514a03bc9b3be8da228ca5";
const redirect_uri = "http://localhost:5500/callback";

const getToken = async () => {
  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: "grant_type=client_credentials",
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    // 토큰 저장
    token = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

// 노래 데이터 검색
let spoty_search_url = `https://api.spotify.com/v1/search?`;

const getData = async (url) => {
  // 토큰이 없을 경우 token 요청
  if (!token) {
    await getToken();
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // 토큰이 만료되어 401 에러가 날 경우 토큰 다시 요청 하고 getData 다시 수행
    if (error.status === 401) {
      await getToken();
      return getData();
    } else {
      console.error("Error:", error);
    }
  }
};

// 검색 type 예시
// album: 앨범
// artist: 아티스트
// playlist: 플레이리스트
// track: 노래

// 검색용 함수
const spotifySearch = (q, type) => {
  let url = `${spoty_search_url}q=${q}&type=${type}`;
  return getData(url);
};

// 검색 기능
const search = async () => {
  try {
    let q = searchInput.value;
    let artistRes = await spotifySearch(q, "artist");
    let albumRes = await spotifySearch(q, "album");
    let trackRes = await spotifySearch(q, "track");

    console.log("artist", artistRes);
    console.log("album", albumRes);
    console.log("track", trackRes);

    if (artistRes?.artists?.items.length !== 0) {
      drawArtist(artistRes);
    }
    drawAlbum(albumRes);
    drawTrack(trackRes);
  } catch (err) {
    console.error(err);
  }
};

// 아티스트 내용 보여주기
const drawArtist = (data) => {
  let artistData = data.artists.items;
  let artistHTML = ``;
  artistHTML = `
    <div>
            <div class="singer-image-top">
                <img src="${artistData[0].images[0].url}" alt="iu_test" style="width: 200px;">
                <span>${artistData[0].name}</span>
            </div>
            <div class="singer-image-bottom">
                <div>
                    <img src="${artistData[1].images[0].url}" style="width: 50px;">
                    <span>${artistData[1].name}</span>
                </div>
                <div>
                    <img src="${artistData[2].images[0].url}" alt="iu_test" style="width: 50px;">
                    <span>${artistData[2].name}</span>
                </div>
                <div>
                    <img src="${artistData[3].images[0].url}" alt="iu_test" style="width: 50px;">
                    <span>${artistData[3].name}</span>
                </div>
            </div>
        </div>
    `;
  document.getElementById("artist-area").innerHTML = artistHTML;
};

// 앨범 내용 보여주기
const drawAlbum = (data) => {
  let albumData = data.albums.items;
  let albumHTML = ``;
  albumData.forEach((data) => {
    albumHTML += `
    <div class="album-container">
    <img src="${data.images[0].url}" alt="" style="width: 100px;">
    <span>${
      data.name.length > 20 ? data.name.substring(0, 20) + "..." : data.name
    }</span>
    <span>${data.artists[0].name}</span>
</div>
    `;
  });
  document.getElementById("album-area").innerHTML = albumHTML;
};

// 곡 내용 보여주기
const drawTrack = (data) => {
  let trackData = data.tracks.items;
  let trackHTML = ``;
  trackData.forEach((data) => {
    trackHTML += `
        <div class="track-container">
        <img src="${data.album.images[0].url}" alt="" style="width: 100px;">
        <span>${
          data.name.length > 20 ? data.name.substring(0, 20) + "..." : data.name
        }</span>
        <span>${data.artists[0].name}</span>
    </div>
        `;
    document.getElementById("track-area").innerHTML = trackHTML;
  });
};

let spoty_newReleases = `https://api.spotify.com/v1/browse/new-releases?country=KR`;
let spoty_kr_category = `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop`;

console.log("new", getData(spoty_newReleases));
console.log("kr", getData(spoty_kr_category));

//SDK 액세스 토근
const device_id =
  "BQBi2AcV1ue_d93guNuxC_-MuaBVbQeIpJBDD0GGaCQoLC42pztSxuSmRJMMh-RJJtD7efAsdccVT5Tk-RIC01efmO3CbFtocfKeKi3HKefFq3Sc0YLIueItr8urgdETvWxLmqW1XL2ZgJaZ7VDis3KpPUbOeuFQbRE5wmlpDB_5Mu7PTemZgAVwoNeUlbcA-rYaZ91xcan12-dOFX5CgABZbXph";

//SDK 액세스 토근 - 초기화
window.onSpotifyWebPlaybackSDKReady = () => {
  getToken();
  const player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  console.log("accept", player);

  //연결이 끊어진 경우 not_ready이벤트
  //1. Ready
  player.addListener("ready", function ({ device_id }) {
    console.log("Ready with Device ID", device_id);
  });

  //2. Not Ready
  player.addListener("not_ready", function ({ device_id }) {
    console.log("Device ID has gone offline", device_id);
  });
};

// 음악 트랙 재생
function playTrack(device_id, trackUri) {
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.access_token, // 토큰에는 access_token이 들어 있습니다.
    },
    body: JSON.stringify({
      uris: [trackUri],
    }),
  })
    .then((response) => {
      if (response.status === 204) {
        console.log("Track is now playing");
      } else {
        console.error("Failed to play track");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 음악 재생 중지
function pauseTrack(device_id) {
  fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.access_token, // 토큰에는 access_token이 들어 있습니다.
    },
  })
    .then((response) => {
      if (response.status === 204) {
        console.log("Playback paused");
      } else {
        console.error("Failed to pause playback");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 재생 버튼 클릭 시 음악 트랙 재생
document.getElementById("playBtn").onclick = function () {
  const trackUri = "spotify:track:TRACK_ID"; // 재생할 트랙의 URI
  playTrack(device_id, trackUri);
};

// 일시 중지 버튼 클릭 시 음악 재생 중지
document.getElementById("pauseBtn").onclick = function () {
  pauseTrack(device_id);
};
