import { getData } from "./modules/getData.js";
import {
  drawError,
  drawArtist,
  drawAlbum,
  drawTrack,
} from "./modules/draws.js";
import { resDataCheck, qCheck } from "./modules/checks.js";
import { duration } from "./modules/duration.js";

// 엔터키 기능 추가
const inputarea = document.getElementById("search-input");
inputarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});
inputarea.addEventListener("focus", () => {
  inputarea.value = "";
});

let spotifyUrl = `https://api.spotify.com/v1/`;

// 검색용 함수
const spotifySearch = ({ q, type }) => {
  let url = `${spotifyUrl}search?q=${q}&type=${type}&limit=6`;
  return getData(url);
};

// 검색 기능
window.search = async (q) => {
  try {
    q = qCheck(q);

    if (q === false) {
      return;
    }

    let artistRes = await spotifySearch({ q, type: "artist" });
    let albumRes = await spotifySearch({ q, type: "album" });
    let trackRes = await spotifySearch({ q, type: "track" });

    console.log(artistRes);

    if (resDataCheck({ artistRes, albumRes, trackRes })) {
      drawError("검색 결과가 없습니다.");
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

// 플레이리스트 검색 기능
window.searchPlaylist = async (id) => {
  try {
    id = "37i9dQZF1DWT9uTRZAYj0c";
    if (!id) {
      return;
    }
    let spotifyPlaylistUrl = `${spotifyUrl}playlists/${id}?market=KR`;
    let playlistRes = await getData(spotifyPlaylistUrl);
    // console.log(playlistRes);
    // playlistRes.tracks.items.forEach((track, index) => {
    //   console.log(
    //     `${index + 1}. ${track.track.name} - ${track.track.artists
    //       .map((artist) => artist.name)
    //       .join(", ")}`
    //   );
    // });
    drawPlayListDetail(playlistRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

const drawPlayListDetail = (playlistRes) => {
  const playlistContainer = document.getElementById("playlist-info");

  let playlistHTML = `<div class="track_info_box">
      <img id="img" src="${playlistRes?.images[0]?.url}" ?? "https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png">
      <div class="track_info">
        <h2>${playlistRes.name}</h2>
        <p class="top_text">${playlistRes.owner.display_name}</p>
        <p class="bottom_text">Total Tracks: ${playlistRes.tracks.total}</p>
        <button class="down_icon"><i class="fa-regular fa-square-plus"></i>보관함에 저장</button>
        <div class="icon_area">
          <button class="heart-btn"><i class="fa-regular fa-heart"></i></button>
          <button class="random"><i class="fa-solid fa-shuffle"></i></button>
        </div>
      </div>
    </div>
    <div class="row list_title">
      <div class="col-1">#</div>
      <div class="col-1"></div>
      <div class="col-3">TITTLE</div>
      <div class="col-3">MUSICIAN</div>
      <div class="col-lg-3 col-sm-4 album">ALBUM</div>
      <div class="col-1 play_time"><i class="fa-regular fa-clock"></i></div>
    </div>
    <ul class="track_container">
  `;

  const albumData = playlistRes.tracks.items;
  albumData.forEach((data, index) => {
    const albumDatas = {
      // 앨범 정보
      albumImageURL: data.track.album.images[0].url,
      albumName: data.track.album.name,
      albumId: data.track.album.id,
      // 재생 시간
      duration: duration(data.track.duration_ms),
    };
    playlistHTML += `
  <li class="row track_music">
    <div class="col-1">${index + 1}</div>
    <div class="col-1"><img src="${
      albumDatas.albumImageURL
    }" alt="Album cover for ${
      albumDatas.albumName
    }" class="album-cover" onclick="searchAlbum('${albumDatas.albumId}')"></div>
    <div class="col-3 name">${data.track.name}</div>
    <div class="col-3">${data.track.artists
      .map((artist) => artist.name)
      .join(", ")}</div>
<<<<<<< HEAD
    <div class="col-lg-3 col-sm-4 album" onclick="searchAlbum('${albumDatas.albumId}')">${
      albumDatas.albumName
    } </div>
=======
    <div class="col-lg-3 col-sm-4 album" onclick="searchAlbum('${
      albumDatas.albumId
    }')">${albumDatas.albumName} </div>
>>>>>>> cb9d348b9c424e90f3198f2bdcd2c80f0b258b48
    <div class="col-lg-1 timer">${albumDatas.duration}</div>
  </li>
`;
  });

  // for (let index = 0; index < playlistRes.tracks.items.length; index++) {
  //   // const trackData = playlistRes.tracks.items[index];
  //   // const track = trackData.track;
  //   // const albumImageUrl = track.album.images[0].url;

  //   //앨범 정보
  //   // const albumId = track.album.id;
  //   // const albumInfoUrl = `${spotifyUrl}albums/${albumId}?market=KR`;
  //   // const albumRes = await getData(albumInfoUrl);

  //   // 재생 시간 가져오기
  //   // const durationMs = track.duration_ms;
  //   // const durationMin = Math.floor(durationMs / 60000);
  //   // const durationSec = ((durationMs % 60000) / 1000).toFixed(0);
  //   // const duration = `${durationMin}:${
  //   //   durationSec < 10 ? "0" : ""
  //   // }${durationSec}`;

  //   playlistHTML += `
  //     <li class="row track_music">
  //       <div class="col-1">${index + 1}</div>
  //       <div class="col-1"><img src="${albumImageUrl}" alt="Album cover for ${
  //     track.album.name
  //   }" class="album-cover"></div>
  //       <div class="col-3 name">${track.name}</div>
  //       <div class="col-3">${track.artists
  //         .map((artist) => artist.name)
  //         .join(", ")}</div>
  //       <div class="col-3">${albumRes.name}</div>
  //       <div class="col-1">${duration}</div>
  //     </li>
  //   `;
  // }

  playlistHTML += `</ul>`;
  playlistContainer.innerHTML = playlistHTML;
};

searchPlaylist();

// 앨범 검색 기능
window.searchAlbum = async (id) => {
  try {
    if (!id) {
      return;
    }
    let spotifyAlbumUrl = `${spotifyUrl}albums/${id}?market=KR`;
    let albumRes = await getData(spotifyAlbumUrl);
    console.log(albumRes);
    drawAlbumDetail(albumRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

const drawAlbumDetail = (albumRes) => {
  const trackData = albumRes.tracks.items;
  trackData.forEach((data, index) => {
    console.log(index + 1, data.name);
  });
};

// 최신앨범 가져오기
const getNewReleaseAlbums = async () => {
  let getNewReleaseAlbumsURL = `${spoty_url}browse/new-releases?country=KR&limit=20`;
  const newReleaseAlbumsRes = await getData(getNewReleaseAlbumsURL);
  console.log("newReleaseAlbumsRes", newReleaseAlbumsRes);
  return newReleaseAlbumsRes.albums.items;
};

window.showNewReleaseAlbums = async () => {
  if (!newReleaseAlbums) {
    newReleaseAlbums = await getNewReleaseAlbums();
  }
  let filteredNewReleaseAlbums;
  newReleaseAlbumsMoreIsValid
    ? (filteredNewReleaseAlbums = newReleaseAlbums)
    : (filteredNewReleaseAlbums = newReleaseAlbums.slice(0, 6));
  newReleaseAlbumsMoreIsValid = !newReleaseAlbumsMoreIsValid;
  console.log(filteredNewReleaseAlbums);
  drawNewReleaseAlbums(filteredNewReleaseAlbums);
};

// K-pop 플레이리스트 가져오기
const getRecommendTracks = async () => {
  let spotipyKpopCategoryURL = `https://api.spotify.com/v1/recommendations?seed_genres=k-pop`;
  const getRecommendTracksRes = await getData(spotipyKpopCategoryURL);
  console.log("getRecommendRes", getRecommendTracksRes);
  return getRecommendTracksRes.tracks;
};

window.showRecommendTracks = async () => {
  if (!recommendTracks) {
    recommendTracks = await getRecommendTracks();
  }
  let filteredrecommendTracks;
  recommendTracksMoreIsValid
    ? (filteredrecommendTracks = recommendTracks)
    : (filteredrecommendTracks = recommendTracks.slice(0, 6));
  recommendTracksMoreIsValid = !recommendTracksMoreIsValid;
  console.log(filteredrecommendTracks);
  drawRecommendTracks(filteredrecommendTracks);
};

const drawNewReleaseAlbums = (filteredNewReleaseAlbums) => {
  const newAlbumHTML = filteredNewReleaseAlbums.map((item) => {
    const artists = item.artists.map((artist) => artist.name).join(", ");
    return `<div class="row">
            <div class="col">
                <div class="col-lg-8">
                    <img class="album-img-size" src=${item.images[0].url} alt="">
                </div>
                <div class="col-lg-4">
                    <h5>${item.name}</h5>
                    <p>${artists}</p>
                </div>
            </div>
        </div>`;
  });

  document.getElementById("lowerBar").innerHTML = newAlbumHTML.join("");
};

const drawRecommendTracks = (drawRecommendTracks) => {
  const recommendLIstHTML = drawRecommendTracks.map((track) => {
    const artists = track.artists.map((artist) => artist.name).join(", ");
    return `<div id="recommendLowerBa">
        <div class="row">
            <div class="col">
                <div class="col-lg-8">
                    <img class="album-img-size" src=${track.album.images[0].url} alt="">
                </div>
                <div class="col-lg-4">
                    <h5>${track.name}</h5>
                    <p>${artists}</p>
                </div>
            </div>
        </div>
    </div>`;
  });

  document.getElementById("recommendLowerBar").innerHTML =
    recommendLIstHTML.join("");
};

showNewReleaseAlbums();
showRecommendTracks();

const genresData = getData("https://api.spotify.com/v1/browse/categories?locale=sv_US")
console.log("장르", genresData);
let limit = 10;
let genreId = "0JQ5DAqbMKFQtzIMjOW2bE" //코리아 뮤직
let playlistsData = getData(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`)
console.log("플레이리스트",playlistsData);

//국내 최신곡 https://api.spotify.com/v1/playlists/37i9dQZF1DXe5W6diBL5N4
let koreaLatestMusic = getData(`https://api.spotify.com/v1/playlists/37i9dQZF1DXe5W6diBL5N4?limit=${limit}`)
console.log("국내최신가요1",koreaLatestMusic);

// 코리안 뮤직 플레이리스트 가져오기
const getKoeanMusic = async () => {
    // 토큰이 없을 경우 token 요청
    if (!token) {
        await getToken();
    }
    url = new URL (`https://api.spotify.com/v1/playlists/37i9dQZF1DXe5W6diBL5N4`)
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });
        const data = await response.json();
        const albums = data.tracks.items         //[0].track.album.images[2]
        const tracks = data.tracks.items;
        console.log("국내최신가요", albums)
        tracks.forEach(track => {
            console.log("음악 이름:", track.track.name);
        });
        return data;
        render();
    } catch (error) {
        // 토큰이 만료되어 401 에러가 날 경우 토큰 다시 요청 하고 getData 다시 수행 getData는 필요에 맞춰 변경해야할듯
        if (error.status === 401) {
            await getToken();
            return getData();
        } else {
            console.error("Error:", error);
        }
    }
};


getKoeanMusic();
