const client_id = "31fc18db9a8f46e7b0f17f84a143787d";
const client_secret = "bbfa00cb2eb0482b98cc830df3de45b0";
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

