let token = "BQBfgysxEW7t5vk5o7rMXjkSaKlBcNAR85AQq1dUhpDvx3CMAG8EexRW3tIJpfApB2CPQ-ZFOufQn_R3IXPdGb8BHcRi_oB8FiNBzDKp0SVsDCu5O4XRZgV6JziQEgj8GjfL6QFa6rpaJPyBtxfsIdBl_Sem2VfDkugDANXjJG80yC13wXvFK2V3wgKdH0XSzr4N3JMawzWSajqJtpo1C1NfmLfC";
const client_id = "31fc18db9a8f46e7b0f17f84a143787d";
const client_secret = "bbfa00cb2eb0482b98cc830df3de45b0";
const redirect_uri = "http://localhost:5500/callback";

let tracks=[];

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

let spoty_kr_category = `https://api.spotify.com/v1/recommendations?market=KR&seed_genres=k-pop`;

// K-pop 플레이리스트 가져오기
const getRecommend = async () => {
    const url = new URL(`${spoty_kr_category}`)
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data2 = await response.json();
    tracks = data2.tracks;
    console.log("왜 안나와?",tracks);

    // tracks 배열에서 각 곡의 name 속성을 가져오기
    const trackNames = tracks.map(track => track.name);

    // trackNames 배열에는 tracks 배열의 각 요소에서 name 속성만을 추출한 배열이 저장됩니다.
    console.log("노래제목",trackNames);

    // data2.tracks.items를 반환하여 다른 곳에서 사용할 수 있도록 함
    return data2.tracks.items;
    render02();
}

// 토큰 요청 후 앨범 정보 가져오기
getToken().then(() => {
    getRecommend().then((tracks) => {
        // tracks 배열에 있는 각 곡의 정보를 사용할 수 있음
        console.log(tracks);
    });
});


const render02 = () => {
    const recommendListHTML = tracks.map((track) => {
        const artists = track.artists.map(artist => artist.name).join(', ');
        return `<div class="row">
            <div class="col">
                <div class="col-lg-8">
                    <img class="album-img-size" src=${track.album.images[0].url} alt="">
                </div>
                <div class="col-lg-4">
                    <h5>${track.name}</h5>
                    <p>${artists}</p>
                </div>
            </div>
        </div>`;
    });

    document.getElementById("lowerBar02").innerHTML = recommendListHTML.join('');
}
