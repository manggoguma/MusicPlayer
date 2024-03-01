let token;
const client_id = "027d68ef08f84e8ebbf9e24aa91a52b5";
const client_secret = "6c38e73980514a03bc9b3be8da228ca5";
const redirect_uri = "http://localhost:5500/callback";

let newReleaseAlbums;
let recommendTracks;
let newReleaseAlbumsMoreIsValid = false;
let recommendTracksMoreIsValid = false;

// 토큰 요청
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
    token = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

let spoty_url = `https://api.spotify.com/v1/`;

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

// 최신앨범 가져오기
const getNewReleaseAlbums = async () => {
  let getNewReleaseAlbumsURL = `${spoty_url}browse/new-releases?country=KR&limit=20`;
  const newReleaseAlbumsRes = await getData(getNewReleaseAlbumsURL);
  console.log("newReleaseAlbumsRes", newReleaseAlbumsRes);
  return newReleaseAlbumsRes.albums.items;
};

const showNewReleaseAlbums = async () => {
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

const showRecommendTracks = async () => {
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