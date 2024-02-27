const client_id = "31fc18db9a8f46e7b0f17f84a143787d";
const client_secret = "bbfa00cb2eb0482b98cc830df3de45b0";
const redirect_uri = "http://localhost:5500/callback";
const albumId=""


let token; 

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
// // 앨범 검색
// const searchAlbum = async (albumName) => {
//     const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`;
//     const response = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token.access_token}`,
//         },
//     });
//     const data = await response.json();
//     console.log("ddd", data);
// }

// // getToken 함수 호출
// getToken().then(() => {
//     // 앨범 검색 함수 호출
//     searchAlbum("Abbey Road"); // 예시 앨범 이름
// });

// 앨범 가져오기
const getAlbum = async () => {
    const url = `https://api.spotify.com/v1/albums?ids=${client_id}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
    });
    const data = await response.json();
    console.log("ddd", data);
}

// getToken 함수 호출
getToken().then(() => {
    // 앨범 가져오기 함수 호출
    getAlbum(); // 예시 앨범 ID
});

const render=()=> {
    const albumHTML=``;

    document.getElementById('lowerBar').innerHTML=albumHTML;
}


