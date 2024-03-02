import { keys } from "../keys.js";
import { drawReset } from "./draws.js";
let { client_id, client_secret } = keys;

// 토큰 요청
const getToken = async ({ client_id, client_secret }) => {
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
    // 토큰 반환
    let token = await response.json();
    return token;
  } catch (error) {
    console.error("Error:", error);
  }
};

let token;

// 데이터 요청
export const getData = async (url) => {
  // 토큰이 없을 경우 token 요청
  if (!token) {
    token = await getToken({ client_id, client_secret });
  }
  try {
    // drawReset();
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
      await getToken({ client_id, client_secret });
      return getData(url);
    } else {
      console.error("Error:", error);
    }
  }
};
