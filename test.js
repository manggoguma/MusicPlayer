
// 토큰 요청
let token;
const client_id = "027d68ef08f84e8ebbf9e24aa91a52b5";
const client_secret = "6c38e73980514a03bc9b3be8da228ca5";
const redirect_uri = "http://localhost:5500/callback";

const fetch = require('node-fetch');

// Spotify API endpoints
const token_url = 'https://accounts.spotify.com/api/token';
const albums_url = 'https://api.spotify.com/v1/albums';

// Spotify API scopes
const scopes = 'user-read-private user-read-email';

// Base64 encode the client_id and client_secret
const client_creds = `${client_id}:${client_secret}`;
const client_creds_b64 = Buffer.from(client_creds).toString('base64');

// Get access token
const token_data = {
    grant_type: 'client_credentials',
    scope: scopes
};
const token_headers = {
    Authorization: `Basic ${client_creds_b64}`
};
fetch(token_url, {
    method: 'POST',
    body: new URLSearchParams(token_data),
    headers: token_headers
})
.then(response => response.json())
.then(token_response_data => {
    const access_token = token_response_data.access_token;

    // Get albums
    const albums_headers = {
        Authorization: `Bearer ${access_token}`
    };
    fetch(albums_url, {
        headers: albums_headers
    })
    .then(response => response.json())
    .then(albums_data => {
        // Print album names
        albums_data.items.forEach(album => {
            console.log(album.name);
        });
    });
});
