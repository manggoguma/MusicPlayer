const client_id = "027d68ef08f84e8ebbf9e24aa91a52b5";
const client_secret = "6c38e73980514a03bc9b3be8da228ca5";
const redirect_uri = "http://localhost:5500/callback";
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
    // 토큰 저장
    token = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

// 검색 type 예시
// album: 앨범
// artist: 아티스트
// playlist: 플레이리스트
// track: 노래

let q = "아이유";
let type = "artist";

// 노래 데이터 요청
const url = new URL(`https://api.spotify.com/v1/search?`);
const getData = async () => {
  // 검색 예시로 넣어놓았고 상황에 맞게 추가 제거 예정
  url.searchParams.set("q", q);
  url.searchParams.set("type", type);
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
    console.log(data.artists);
    // let contentHTML = ``;
    // contentHTML += `${data.artists}`;
    // document.getElementById("content").innerHTML = contentHTML;
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
getData();
