let token;
const client_id = "31fc18db9a8f46e7b0f17f84a143787d";
const client_secret = "bbfa00cb2eb0482b98cc830df3de45b0";
const redirect_uri = "http://localhost:5500/callback";

let albums = [];
let tracks = [];
let folderMore = false;

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
    console.log("토큰", token);
};

getToken();

// 노래 데이터 요청
let spoty_url = `https://api.spotify.com/v1/search?`;

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
        // 토큰이 만료되어 401 에러가 날 경우 토큰 다시 요청 하고 getData 다시 수행 getData는 필요에 맞춰 변경해야할듯
        if (error.status === 401) {
            await getToken();
            return getData();
        } else {
            console.error("Error:", error);
        }
    }
};

// 최신앨범 가져오기
const getNewAlbum = async () => {
    const url = new URL(
        `https://api.spotify.com/v1/browse/new-releases?country=KR&limit=6`
    );
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    console.log("zzzzzzz", data);
    albums = data.albums.items;
    render();
};

// 더보기 함수(최신)
const openMore = async () => {
    const url = new URL(
        `https://api.spotify.com/v1/browse/new-releases?country=KR&limit=20`
    );
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    albums = data.albums.items;
    render();
    folderMore = true;
};

// 기존 6개만 다시 보여주기(최신)
const returnOri = async () => {
    const url = new URL(
        `https://api.spotify.com/v1/browse/new-releases?country=KR&limit=6`
    );
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    albums = data.albums.items;
    render();
    folderMore = false;
};

const toggleMore = () => {
    if (folderMore) {
        returnOri();
    } else {
        openMore();
    }
    folderMore = !folderMore;
};


//
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



// const _getGenres = async (token) => {

//     const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
//         method: 'GET',
//         headers: { 'Authorization' : 'Bearer ' + token}
//     });

//     const data = await result.json();
//     console.log("카테고리", data)
//     return data.categories.items;
// }

// _getGenres();

// const _getPlaylistByGenre = async (token, genreId) => {

//     const limit = 10;
    
//     const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
//         method: 'GET',
//         headers: { 'Authorization' : 'Bearer ' + token}
//     });

//     const data = await result.json();
//     return data.playlists.items;
// }


// let spoty_kr_category = `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop&limit=6`;

// // K-pop 플레이리스트 가져오기
// const getRecommend = async () => {
//     const url = new URL(`${spoty_kr_category}`);
//     const response = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token.access_token}`,
//         },
//     });

//     const data2 = await response.json();
//     tracks = data2.tracks;
//     console.log("왜 안나와?", tracks);

//     // tracks 배열에서 각 곡의 name 속성을 가져오기
//     const trackNames = tracks.map((track) => track.name);

//     // trackNames 배열에는 tracks 배열의 각 요소에서 name 속성만을 추출한 배열이 저장됩니다.
//     console.log("노래제목", trackNames);

//     // data2.tracks.items를 반환하여 다른 곳에서 사용할 수 있도록 함
//     return data2.tracks.items;
// };

getToken().then(() => {
    getNewAlbum();
    getRecommend();
});

// // k-pop 더보기
// const recommendMore = async () => {
//     const url = new URL(
//         `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop&limit=20`
//     );
//     const response = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token.access_token}`,
//         },
//     });
//     const data2 = await response.json();
//     tracks = data2.tracks.items;
//     render();
//     folderMore = true;
// };

// // 기존 6개만 다시 보여주기(k-pop)
// const recommendOri = async () => {
//     const url = new URL(
//         `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop&limit=6`
//     );
//     const response = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token.access_token}`,
//         },
//     });

//     const data2 = await response.json();
//     tracks = data2.tracks.items;
//     render();
//     folderMore = false;
// };

// const recommendToggleMore = () => {
//     if (folderMore) {
//         recommendOri();
//     } else {
//         recommendMore();
//     }
//     folderMore = !folderMore;
// };



const render = () => {
    const newAlbumHTML = albums.map((item) => {
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

    const recommendLIstHTML = tracks.map((track) => {
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

    document.getElementById("recommendLowerBar").innerHTML = recommendLIstHTML.join("");
};





