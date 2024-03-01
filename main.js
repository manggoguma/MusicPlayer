import { getData } from "./modules/getData.js";
import {
  drawError,
  drawArtist,
  drawAlbum,
  drawTrack,
} from "./modules/draws.js";
import { resDataCheck, qCheck } from "./modules/checks.js";

// 엔터키 기능 추가
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});

let spotifyUrl = `https://api.spotify.com/v1/`;

// 검색 type 예시
// album: 앨범
// artist: 아티스트
// playlist: 플레이리스트
// track: 노래

// 검색용 함수
const spotifySearch = ({ q, type }) => {
  let url = `${spotifyUrl}search?q=${q}&type=${type}`;
  return getData(url);
};

// 검색 기능
window.search = async (q) => {
  try {
    q = qCheck(q);
    let artistRes = await spotifySearch({ q, type: "artist" });
    let albumRes = await spotifySearch({ q, type: "album" });
    let trackRes = await spotifySearch({ q, type: "track" });

    console.log("artist", artistRes);
    console.log("album", albumRes);
    console.log("track", trackRes);

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

// let spoty_newReleases = `https://api.spotify.com/v1/browse/new-releases?country=KR`;
// let spoty_kr_category = `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop`;
// let spoty_kr_playList = `https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFQtzIMjOW2bE/playlists`;

// console.log("new", getData(spoty_newReleases));
// console.log("kr", getData(spoty_kr_category));
// console.log("playlist", getData(spoty_kr_playList));

// 검색 결과 앨범 눌렀을 때 앨범 데이터 받아오는 거 까지
window.searchAlbum = async (id) => {
  let spotifyAlbumUrl = `${spotifyUrl}albums/${id}?market=KR`;
  let albumRes = await getData(spotifyAlbumUrl);
  console.log(albumRes);
};

// 플레이리스트 id 받아서 정보받아오는거까지 (일단 임의의 playlist id 사용함)
const searchPlaylist = async (id) => {
  id = "37i9dQZF1DWT9uTRZAYj0c";
  let spotifyPlaylistUrl = `${spotifyUrl}playlists/${id}?market=KR`;
  let playlistRes = await getData(spotifyPlaylistUrl);
  console.log(playlistRes);
  playlistRes.tracks.items.forEach((track, index) => {
    console.log(
      `${index + 1}. ${track.track.name} - ${track.track.artists
        .map((artist) => artist.name)
        .join(", ")}`
    );
  });
  return playlistRes;
};

// 플레이 리스트 정보 받아오는 함수 실행
searchPlaylist();

const displayPlaylistInfo = async () => {
  try {
    const playlistRes = await searchPlaylist();
    const playlistContainer = document.getElementById("playlist-info");

    let playlistHTML = `<div class="track_info_box">
        <img id="img" class="" width="264" src="https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png">
        <div class="track_info">
          <h2>Playlist Name: ${playlistRes.name}</h2>
          <p class="top_text">Owner: ${playlistRes.owner.display_name}</p>
          <p class="bottom_text">Total Tracks: ${playlistRes.tracks.total}</p>
        </div>
      </div>
      <div class="row list_title">
        <div class="col-1">#</div>
        <div class="col-1"></div>
        <div class="col-3">TITTLE</div>
        <div class="col-3">MUSICIAN</div>
        <div class="col-3">ALBUM</div>
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
      const duration = `${durationMin}:${
        durationSec < 10 ? "0" : ""
      }${durationSec}`;

      playlistHTML += `
        <li class="row track_music">
          <div class="col-1">${index + 1}</div>
          <div class="col-1"><img src="${albumImageUrl}" alt="Album cover for ${
        track.album.name
      }" class="album-cover"></div>
          <div class="col-3 name">${track.name}</div>
          <div class="col-3">${track.artists
            .map((artist) => artist.name)
            .join(", ")}</div>
          <div class="col-3">${albumRes.name}</div>
          <div class="col-1">${duration}</div>
        </li>
      `;
    }

    playlistHTML += `</ul>`;
    playlistContainer.innerHTML = playlistHTML;
  } catch (error) {
    console.error("Error displaying playlist info:", error);
  }
};

displayPlaylistInfo();
