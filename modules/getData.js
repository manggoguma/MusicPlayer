let spotifyURL = `https://api.spotify.com/v1/`;

let token;

// 토큰 요청 함수
const getToken = async () => {
  try {
    const reponse = await fetch("./netlify/function/getToken");
    token = await reponse.json();
  } catch (error) {
    console.error(error);
  }
};

// 데이터 요청
export const getData = async (url) => {
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

// 검색용 함수
export const spotifySearch = ({ q, type }) => {
  let url = `${spotifyURL}search?q=${q}&type=${type}&limit=6`;
  return getData(url);
};

//
// ========== 요청 서버 따로 두는 경우 ==========
// const TEST_URL = "http://localhost:3001/getData/";
// const API_URL = "api/getData";
// const spotifyURL = `https://api.spotify.com/v1/`;

// export const getData = async (url) => {
//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ url: url }),
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// // 검색용 함수
// export const spotifySearch = ({ q, type }) => {
//   let url = `${spotifyURL}search?q=${q}&type=${type}&limit=6`;
//   return getData(url);
// };
