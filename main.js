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

let newReleaseAlbums;
let recommendTracks;
let newReleaseAlbumsMoreIsValid = false;
let recommendTracksMoreIsValid = false;

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
    <div class="col-lg-3 col-sm-4 album" onclick="searchAlbum('${
      albumDatas.albumId
    }')">${albumDatas.albumName} </div>
    <div class="col-lg-1 timer">${albumDatas.duration}</div>
  </li>
`;
  });
  playlistHTML += `</ul>`;
  playlistContainer.innerHTML = playlistHTML;
};

// 앨범 검색 기능
window.searchAlbum = async (id) => {
  try {
    if (!id) {
      return;
    }
    let spotifyAlbumUrl = `${spotifyUrl}albums/${id}?market=KR`;
    let albumRes = await getData(spotifyAlbumUrl);
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

let spoty_url = `https://api.spotify.com/v1/`;

// 최신앨범 가져오기
const getNewReleaseAlbums = async () => {
  let getNewReleaseAlbumsURL = `${spoty_url}browse/new-releases?country=KR&limit=20`;
  const newReleaseAlbumsRes = await getData(getNewReleaseAlbumsURL);
  // console.log("newReleaseAlbumsRes", newReleaseAlbumsRes);
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

// K-pop 노래 가져오기
const getRecommendTracks = async () => {
  let spotipyKpopCategoryURL = `https://api.spotify.com/v1/recommendations?seed_genres=k-pop`;
  const getRecommendTracksRes = await getData(spotipyKpopCategoryURL);
  // console.log("getRecommendRes", getRecommendTracksRes);
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
  // console.log(filteredrecommendTracks);
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

// showNewReleaseAlbums();
// showRecommendTracks();

// K-pop 플레이리스트 가져오기
const getRecommendPlaylist = async () => {
  let spotipyKpopPlayListURL = `https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFQtzIMjOW2bE/playlists`;
  const spotipyKpopPlayListRes = await getData(spotipyKpopPlayListURL);
  // console.log(spotipyKpopPlayListRes);
  drawRecommendPlaylist(spotipyKpopPlayListRes);
};

const drawRecommendPlaylist = (spotipyKpopPlayListRes) => {
  let kpopPlayList = spotipyKpopPlayListRes.playlists.items;
  console.log(kpopPlayList);
};

getRecommendPlaylist();
