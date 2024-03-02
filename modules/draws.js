import { duration } from "./duration.js";

// 화면 리셋하기
export const drawPlayList = () => {
  let playListHTML = `
  <div class="track_container">
            <div id="playlist-info">
                <!-- 플레이리스트 -->
            </div>
        </div>
  `;
  document.getElementById("content").innerHTML = playListHTML;
};

export const drawSearch = () => {
  let searchHTML = `
  <div id="artist-area">
            <!-- 아티스트 정보 -->
            <div id="singer-top" class="singer-image-top">
                <!-- 메인 가수 -->
            </div>
            <div class="sub_area">
              <h3>관련있는 아티스트</h3>
              <div id="singer-bottom" class="singer-image-bottom">
                  <!-- 서브 가수 -->
              </div>
            </div>              
        </div>
        <div class="album_box">
          <h3>앨범</h3>
          <div id="album-area">
              <!-- 앨범 정보 -->
          </div>
        </div>       
        <div class="track_box">
        <h3>노래</h3>
          <div id="track-area">
              <!-- 곡 정보 -->
          </div>
        </div>`;
  document.getElementById("content").innerHTML = searchHTML;
};

// 에러 보여주기
export const drawError = (err) => {
  let errorHTML = `
  <div id="artist-area">
    <!-- 아티스트 정보 -->
  <div id="singer-top" class="singer-image-top">
      <!-- 메인 가수 -->
  </div>
  <div id="singer-bottom" class="singer-image-bottom">
    <div class="linked_area">
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
export const drawArtist = ({ artists }) => {
  let artistData = artists.items;
  document.getElementById("singer-top").innerHTML = `
    <img src="${
      artistData[0].images[0]?.url || "./image/no_image.jpeg"
    }" alt="${artistData[0].name}" >
    </div>
    <span>${artistData[0].name}</span>`;
  let artistHTML = ``;
  if (artistData.length > 1) {
    let num = artistData.length > 4 ? 4 : artistData.length;
    for (let i = 1; i < num; i++) {
      artistHTML += `
        <div class="linked_artist">
          <div class="linked_img">
            <img src="${
              artistData[i].images[0]?.url || "./image/no_image.jpeg"
            }" alt="${artistData[i].name}" onclick="search('${
        artistData[i].name
      }')" ></div>
          <span>${artistData[i].name}</span>
        </div>
        `;
    }
  }
  document.getElementById("singer-bottom").innerHTML = artistHTML;
};

// 앨범 내용 보여주기
export const drawAlbum = ({ albums }) => {
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
      <img src="${albumObj.img}" alt="${albumObj.name}" onclick="searchAlbum('${
      albumObj.id
    }')">
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
export const drawTrack = ({ tracks }) => {
  let trackHTML = ``;
  tracks.items.forEach((data) => {
    const trackObj = {
      img:
        data.album.images[0].length === 0
          ? "./image/no_image.jpeg"
          : data.album.images[0].url,
      trackName: data.name,
      artistName: data.artists[0].name,
      albumName: data.album.name,
      duration: duration(data.duration_ms),
    };
    console.log(trackObj.albumName, trackObj.duration);
    trackHTML += `
          <div class="track-container row">
            <div class="col-2">
              <img src="${trackObj.img}" alt="">
            </div>
          <span class="col-2 name">${
            trackObj.trackName.length > 20
              ? trackObj.trackName.substring(0, 20) + "..."
              : trackObj.trackName
          }</span>
          <span class="col-2">${trackObj.artistName}</span>
          <span class="col-4">${trackObj.albumName}</span>
          <span class="col-2">${trackObj.duration}</span>
      </div>
          `;
    document.getElementById("track-area").innerHTML = trackHTML;
  });
};
