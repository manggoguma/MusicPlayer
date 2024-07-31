import fetch from "node-fetch";
import { Buffer } from "buffer";
import querystring from "querystring";

const encodeCredentials = (clientId, clientSecret) => {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
};

export const handler = async (event, context) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodeCredentials(client_id, client_secret)}`,
    },
    body: querystring.stringify({ grant_type: "client_credentials" }),
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    if (!response.ok) throw new Error("Failed to fetch token");
    const token = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(token),
    };
  } catch (error) {
    console.error("Error fetching token:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
