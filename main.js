import { resDataCheck, qCheck, resDataCheck2 } from "./modules/checks.js";
import {
  drawError,
  drawSearch,
  drawPlayList,
  drawArtist,
  drawAlbum,
  drawTrack,
} from "./modules/draws.js";
import {
  drawNewReleaseAlbums,
  drawPlayListDetail,
  drawRecommendPlaylist,
  drawRecommendTracks,
  drawAlbumDetail,
} from "./modules/draws2.js";
import { getData, spotifySearch } from "./modules/getData.js";
import { spotifyURLs } from "./modules/urls.js";

const spotifyURL = spotifyURLs.spotifyURL;
let newReleaseAlbums;
let newReleaseAlbumsMoreIsValid = false;
let recommendTracks;
let recommendTracksMoreIsValid = false;

// 엔터키 기능 추가
const inputarea = document.getElementById("search-input");
inputarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});
// 검색어 자동삭제 기능
inputarea.addEventListener("focus", () => {
  inputarea.value = "";
});

// 검색 결과 보여주기
window.search = async (q) => {
  try {
    // 가수를 눌러서 q값을 받은게 아니라면 검색어의 q를 넣고, 둘 다 값이 없으면 q에 false를 넣음
    q = qCheck(q);
    if (q === false) {
      return;
    }
    let artistRes = await spotifySearch({ q, type: "artist" });
    let albumRes = await spotifySearch({ q, type: "album" });
    let trackRes = await spotifySearch({ q, type: "track" });

    drawSearch();
    if (resDataCheck({ artistRes, albumRes, trackRes })) {
      drawError("검색 결과가 없습니다.");
      return;
    }
    // 아티스트는 디자인이 독특해서 값이 없으면 에러가 나므로 체크해주기
    if (artistRes?.artists?.items.length !== 0) {
      drawArtist(artistRes);
    }

    // 앨범과 노래 검색결과가 안나오는건 대부분 잘못된 검색값이므로 체크해주기
    if (resDataCheck2({ albumRes, trackRes })) {
      drawError("검색 결과가 없습니다.");
      return;
    }
    drawAlbum(albumRes);
    drawTrack(trackRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// 최신앨범 보여주기 + more 버튼
window.showNewReleaseAlbums = async () => {
  try {
    // 최신앨범 변수에 값이 없으면 데이터 요청해서 넣기
    if (!newReleaseAlbums) {
      newReleaseAlbums = await getData(spotifyURLs.releaseAlbums);
      newReleaseAlbums = newReleaseAlbums.albums.items;
    }
    // more 버튼의 상태를 체크해서 그에 맞는 데이터를 filtered 변수에 담기
    let filteredNewReleaseAlbums;
    newReleaseAlbumsMoreIsValid
      ? (filteredNewReleaseAlbums = newReleaseAlbums)
      : (filteredNewReleaseAlbums = newReleaseAlbums.slice(0, 6));
    // more 버튼의 상태를 반대로 바꿈
    newReleaseAlbumsMoreIsValid = !newReleaseAlbumsMoreIsValid;
    drawNewReleaseAlbums(filteredNewReleaseAlbums);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// K-POP 보여주기 + more 버튼
window.showRecommendTracks = async () => {
  try {
    if (!recommendTracks) {
      recommendTracks = await getData(spotifyURLs.spotipyKpopCategoryURL);
      recommendTracks = recommendTracks.tracks;
    }
    let filteredrecommendTracks;
    recommendTracksMoreIsValid
      ? (filteredrecommendTracks = recommendTracks)
      : (filteredrecommendTracks = recommendTracks.slice(0, 6));
    recommendTracksMoreIsValid = !recommendTracksMoreIsValid;
    drawRecommendTracks(filteredrecommendTracks);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// K-pop 플레이리스트 보여주기
const getRecommendPlaylist = async () => {
  try {
    const spotipyKpopPlayListRes = await getData(
      spotifyURLs.spotipyKpopPlayListURL
    );
    drawRecommendPlaylist(spotipyKpopPlayListRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// 플레이리스트 id 가져와서 그리기
window.searchPlaylist = async (id) => {
  try {
    if (!id) {
      return;
    }
    let playlistRes = await getData(`${spotifyURL}playlists/${id}?market=KR`);
    drawPlayList();
    window.scrollTo({
      top: 0,
      left: 0,
    });
    drawPlayListDetail(playlistRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

// 앨범 id 가져와서 그리기
window.searchAlbum = async (id) => {
  try {
    if (!id) {
      return;
    }
    let albumRes = await getData(`${spotifyURL}albums/${id}?market=KR`);
    drawPlayList();
    window.scrollTo({
      top: 0,
      left: 0,
    });
    drawAlbumDetail(albumRes);
  } catch (err) {
    console.error(err);
    drawError(err);
  }
};

const mainPage = () => {
  showNewReleaseAlbums();
  showRecommendTracks();
  getRecommendPlaylist();
};
mainPage();
