const client_id = "";
const client_secret = "";
const redirect_uri = "http://localhost:5500/callback";
let token = "";

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

const url = new URL(`https://api.spotify.com/v1/search?`);
let q = "최신 음악";
let type = "track";
let contentHTML = ``;
// album: 앨범
// artist: 아티스트
// playlist: 플레이리스트
// track: 노래

// 노래 데이터 요청
const getData = async () => {
  await getToken();

  url.searchParams.set("q", q);
  url.searchParams.set("type", type);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    contentHTML += `${data}`;
    document.getElementById("content").innerHTML = contentHTML;
  } catch (error) {
    console.error("Error:", error);
  }
};

getData();
