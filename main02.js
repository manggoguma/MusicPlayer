let token = "BQBfgysxEW7t5vk5o7rMXjkSaKlBcNAR85AQq1dUhpDvx3CMAG8EexRW3tIJpfApB2CPQ-ZFOufQn_R3IXPdGb8BHcRi_oB8FiNBzDKp0SVsDCu5O4XRZgV6JziQEgj8GjfL6QFa6rpaJPyBtxfsIdBl_Sem2VfDkugDANXjJG80yC13wXvFK2V3wgKdH0XSzr4N3JMawzWSajqJtpo1C1NfmLfC";
const client_id = "31fc18db9a8f46e7b0f17f84a143787d";
const client_secret = "bbfa00cb2eb0482b98cc830df3de45b0";
const redirect_uri = "http://localhost:5500/callback";

let albums=[];

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

// 최신앨범 가져오기
const getNewAlbum = async () => {
    const url = new URL(`https://api.spotify.com/v1/browse/new-releases?country=KR&limit=6`);
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    albums = data.albums.items;
    render();    
};

// 토큰 요청 후 앨범 정보 가져오기
getToken().then(() => {
    getNewAlbum();
});

// 더보기 함수
let folderMore = false;

const openMore = async () => {
    const url = new URL(`https://api.spotify.com/v1/browse/new-releases?country=KR&limit=20`);
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    albums = data.albums.items;
    render();
    folderMore=true;
};

// 기존 6개만 다시 보여주기
const returnOri = async () => {
    const url = new URL(`https://api.spotify.com/v1/browse/new-releases?country=KR&limit=6`);
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

const render = () => {
    const newAlbumHTML = albums.map((item) => {
        const artists = item.artists.map(artist => artist.name).join(', ');
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

    document.getElementById("lowerBar").innerHTML = newAlbumHTML.join('');
    
}


