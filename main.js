import { getData } from "./modules/getData.js";
import {
  drawError,
  drawArtist,
  drawAlbum,
  drawTrack,
} from "./modules/draws.js";
import {
  drawPlayListDetail,
  drawNewReleaseAlbums,
  drawRecommendTracks,
  drawRecommendPlaylist,
} from "./modules/draws2.js";
import { resDataCheck, qCheck } from "./modules/checks.js";

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
  // console.log(filteredNewReleaseAlbums);
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

showNewReleaseAlbums();
showRecommendTracks();

// K-pop 플레이리스트 가져오기
const getRecommendPlaylist = async () => {
  let spotipyKpopPlayListURL = `https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFQtzIMjOW2bE/playlists`;
  const spotipyKpopPlayListRes = await getData(spotipyKpopPlayListURL);
  // console.log(spotipyKpopPlayListRes);
  drawRecommendPlaylist(spotipyKpopPlayListRes);
};

getRecommendPlaylist();
