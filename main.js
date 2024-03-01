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
  let url = `${spotifyUrl}search?q=${q}&type=${type}`;
  return getData(url);
};

// 검색 기능
window.search = async (q) => {
  try {
    if (qCheck(q) === false) {
      return;
    }
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

// 검색 결과 앨범 눌렀을 때 앨범 데이터 받아오는 거 까지
window.searchAlbum = async (id) => {
  let spotifyAlbumUrl = `${spotifyUrl}albums/${id}?market=KR`;
  let albumRes = await getData(spotifyAlbumUrl);
  console.log(albumRes);
};

// 플레이리스트 id 받아서 정보받아오는거까지 (일단 임의의 playlist id 사용함)
window.searchPlaylist = async (id) => {
  try {
    id = "37i9dQZF1DWT9uTRZAYj0c";
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
      <img id="img" class="" width="250" src="${playlistRes?.images[0]?.url}" ?? "https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png">
      <div class="track_info">
        <h2>${playlistRes.name}</h2>
        <p class="top_text">${playlistRes.owner.display_name}</p>
        <p class="bottom_text">Total Tracks: ${playlistRes.tracks.total}</p>
        <button class="down_icon"><i class="fa-regular fa-square-plus"></i>보관함 저장하기</button>
        <button class="heart-btn"><i class="fa-regular fa-heart"></i></button>
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

  const trackData = playlistRes.tracks.items;
  trackData.forEach((data, index) => {
    const trackDatas = {
      // 앨범 정보
      albumImageURL: data.track.album.images[0].url,
      albumName: data.track.album.name,
      // 재생 시간
      duration: duration(data.track.duration_ms),
    };
    playlistHTML += `
  <li class="row track_music">
    <div class="col-1">${index + 1}</div>
    <div class="col-1"><img src="${
      trackDatas.albumImageURL
    }" alt="Album cover for ${trackDatas.albumName}" class="album-cover"></div>
    <div class="col-3 name">${data.track.name}</div>
    <div class="col-3">${data.track.artists
      .map((artist) => artist.name)
      .join(", ")}</div>
    <div class="col-3">${trackDatas.albumName}</div>
    <div class="col-1">${trackDatas.duration}</div>
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
