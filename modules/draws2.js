// 플레이리스트 디테일 - 명은님
import { duration } from "./duration.js";

export const drawPlayListDetail = (playlistRes) => {
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
      albumImageURL:
        data?.track?.album?.images[0].url ??
        "https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png",
      albumName: data?.track?.album?.name ?? "-",
      albumId: data?.track?.album?.id ?? "-",
      // 재생 시간
      duration:
        duration(data?.track?.duration_ms) == `NaN:NaN`
          ? "-"
          : duration(data?.track?.duration_ms),
    };
    playlistHTML += `
    <li class="row track_music">
      <div class="col-1">${index + 1}</div>
      <div class="col-1"><img src="${
        albumDatas.albumImageURL
      }" alt="Album cover for ${
      albumDatas.albumName
    }" class="album-cover" onclick="searchAlbum('${albumDatas.albumId}')"></div>
      <div class="col-3 name">${data?.track?.name ?? "-"}</div>
      <div class="col-3">${
        data?.track?.artists.map((artist) => artist.name).join(", ") ?? "-"
      }</div>
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

// New release for you - 하은님 1
export const drawNewReleaseAlbums = (filteredNewReleaseAlbums) => {
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

// K-POP - 하은님 2
export const drawRecommendTracks = (drawRecommendTracks) => {
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

// 추천 playList - 문건님 + 하은님
export const drawRecommendPlaylist = (spotipyKpopPlayListRes) => {
  let kpopPlayList = spotipyKpopPlayListRes.playlists.items;
  let filteredKpopPlayList = kpopPlayList.splice(0, 6);
  // console.log("여기요", filteredKpopPlayList);

  const recommendPlaylistHTML = filteredKpopPlayList.map((items) => {
    return `<div class="row">
      <div class="col">
      <div class="col-lg-8">
      <img class="album-img-size" src=${items.images[0].url} alt="${items.name}" onclick="searchPlaylist('${items.id}')">
      </div>
      <div class="col-lg-4">
      <h5>${items.name}</h5>
      </div>
      </div>
      </div>`;
  });

  document.getElementById("recommendListLowerBar").innerHTML =
    recommendPlaylistHTML.join("");
};
