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

let spotifyUrl = `https://api.spotify.com/v1/`;

// 데이터 요청
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
      return getData(url);
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
  let url = `${spotifyUrl}search?q=${q}&type=${type}`;
  return getData(url);
};

// 검색 기능
let q = "";
const search = async (q) => {
  try {
    q ? q : (q = searchInput.value);
    let artistRes = await spotifySearch(q, "artist");
    let albumRes = await spotifySearch(q, "album");
    let trackRes = await spotifySearch(q, "track");

    console.log("artist", artistRes);
    console.log("album", albumRes);
    console.log("track", trackRes);

    if (
      artistRes?.artists?.items.length === 0 &&
      albumRes?.albums?.items.length === 0 &&
      trackRes?.tracks?.items.length === 0
    ) {
      drawError("검색 결과가 없습니다.");
      console.log("erere");
      return;
    }
    if (artistRes?.artists?.items.length !== 0) {
      drawArtist(artistRes);
    }
    drawAlbum(albumRes);
    drawTrack(trackRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// 에러 보여주기
const drawError = (err) => {
  let errorHTML = `
  <div id="artist-area">
  <!-- 아티스트 정보 -->
  <div id="singer-top" class="singer-image-top">
      <!-- 메인 가수 -->
  </div>
  <div id="singer-bottom" class="singer-image-bottom">
      <!-- 서브 가수 -->
  </div>
</div>
<div id="album-area">
  <!-- 앨범 정보 -->
  <div>
  ${err}
</div>
</div>
<div id="track-area">
  <!-- 곡 정보 -->
</div>
  `;
  document.getElementById("content").innerHTML = errorHTML;
};

// 아티스트 내용 보여주기
const drawArtist = ({ artists }) => {
  let artistData = artists.items;
  document.getElementById("singer-top").innerHTML = `
  <img src="${artistData[0].images[0]?.url || "./image/no_image.jpeg"}" alt="${
    artistData[0].name
  }" style="width: 200px;">
  <span>${artistData[0].name}</span>`;
  let artistHTML = ``;
  if (artistData.length > 1) {
    let num = artistData.length > 4 ? 4 : artistData.length;
    for (let i = 1; i < num; i++) {
      artistHTML += `
      <div>
          <img src="${
            artistData[i].images[0]?.url || "./image/no_image.jpeg"
          }" alt="${artistData[i].name}" onclick="search('${
        artistData[i].name
      }')" style="width: 50px;">
          <span>${artistData[i].name}</span>
      </div>
      `;
    }
  }
  document.getElementById("singer-bottom").innerHTML = artistHTML;
};

// 앨범 내용 보여주기
const drawAlbum = ({ albums }) => {
  let albumHTML = ``;
  albums.items.forEach((data) => {
    const albumObj = {
      img:
        data.images[0].length === 0
          ? "./image/no_image.jpeg"
          : data.images[0].url,
      albumName: data.name,
      artistName: data.artists[0].name,
      id: data.id,
    };
    albumHTML += `
    <div class="album-container">
    <img src="${albumObj.img}" alt="${
      albumObj.name
    }" style="width: 100px;" onclick="searchAlbum('${albumObj.id}')">
    <span>${
      albumObj.albumName.length > 20
        ? albumObj.albumName.substring(0, 20) + "..."
        : albumObj.albumName
    }</span>
    <span>${albumObj.artistName}</span>
</div>
    `;
  });
  document.getElementById("album-area").innerHTML = albumHTML;
};

// 곡 내용 보여주기
const drawTrack = ({ tracks }) => {
  let trackHTML = ``;
  tracks.items.forEach((data) => {
    const trackObj = {
      img:
        data.album.images[0].length === 0
          ? "./image/no_image.jpeg"
          : data.album.images[0].url,
      trackName: data.name,
      artistName: data.artists[0].name,
    };
    trackHTML += `
        <div class="track-container">
        <img src="${trackObj.img}" alt="" style="width: 100px;">
        <span>${
          trackObj.trackName.length > 20
            ? trackObj.trackName.substring(0, 20) + "..."
            : trackObj.trackName
        }</span>
        <span>${trackObj.artistName}</span>
    </div>
        `;
    document.getElementById("track-area").innerHTML = trackHTML;
  });
};

// let spoty_newReleases = `https://api.spotify.com/v1/browse/new-releases?country=KR`;
// let spoty_kr_category = `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop`;
// let spoty_kr_playList = `https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFQtzIMjOW2bE/playlists`;

// console.log("new", getData(spoty_newReleases));
// console.log("kr", getData(spoty_kr_category));
// console.log("playlist", getData(spoty_kr_playList));

// 검색 결과 앨범 눌렀을 때 앨범 데이터 받아오는 거 까지
const searchAlbum = async (id) => {
  let spotifyAlbumUrl = `${spotifyUrl}albums/${id}?market=KR`;
  let albumRes = await getData(spotifyAlbumUrl);
  console.log(albumRes);
};

// 플레이리스트 id 받아서 정보받아오는거까지 (일단 임의의 platlist id 사용함)
const searchPlaylist = async (id) => {
  id = "37i9dQZF1DWT9uTRZAYj0c";
  let spotifyPlaylistUrl = `${spotifyUrl}playlists/${id}?market=KR`;
  let playlistRes = await getData(spotifyPlaylistUrl);
  console.log(playlistRes);
  playlistRes.tracks.items.forEach((track, index) => {
    console.log(`${index + 1}. ${track.track.name} - ${track.track.artists.map(artist => artist.name).join(", ")}`);
  });
    return playlistRes;
};


// 플레이 리스트 정보 받아오는 함수 실행
searchPlaylist();

const displayPlaylistInfo = async () => {
  try {
    const playlistRes = await searchPlaylist();
    const playlistContainer = document.getElementById("playlist-info");

    let playlistHTML = `<div class="track_info">
        <h2>Playlist Name: ${playlistRes.name}</h2>
        <p>Owner: ${playlistRes.owner.display_name}</p>
        <p>Total Tracks: ${playlistRes.tracks.total}</p>
      </div>
      <div class="row list_title">
        <div class="col-1">#</div>
        <div class="col-1"></div>
        <div class="col-4">TITTLE</div>
        <div class="col-1">MUSICIAN</div>
        <div class="col-4">ALBUM</div>
        <div class="col-1"><i class="fa-regular fa-clock"></i></div>
      </div>
      <ul class="track_container">
    `;

    for (let index = 0; index < playlistRes.tracks.items.length; index++) {
      const trackData = playlistRes.tracks.items[index];
      const track = trackData.track;
      const albumImageUrl = track.album.images[0].url;

      //앨범 정보
      const albumId = track.album.id;
      const albumInfoUrl = `${spotifyUrl}albums/${albumId}?market=KR`;
      const albumRes = await getData(albumInfoUrl);

      // 재생 시간 가져오기
      const durationMs = track.duration_ms;
      const durationMin = Math.floor(durationMs / 60000);
      const durationSec = ((durationMs % 60000) / 1000).toFixed(0);
      const duration = `${durationMin}:${(durationSec < 10 ? '0' : '')}${durationSec}`;

      playlistHTML += `
        <li class="row track_music">
          <div class="col-1">${index + 1}</div>
          <div class="col-1"><img src="${albumImageUrl}" alt="Album cover for ${track.album.name}" class="album-cover"></div>
          <div class="col-4">${track.name}</div>
          <div class="col-1">${track.artists.map(artist => artist.name).join(", ")}</div>
          <div class="col-4">${albumRes.name}</div>
          <div class="col-1">${duration}</div>
        </li>
      `;
    }

    playlistHTML += `</ul>`;
    playlistContainer.innerHTML = playlistHTML;
  } catch (error) {
    console.error("Error displaying playlist info:", error);
  }
}

displayPlaylistInfo();
