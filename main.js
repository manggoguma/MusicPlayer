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
};

// 플레이 리스트 정보 받아오는 함수 실행
searchPlaylist();
