const crypto = require('crypto');
const fetch = require('node-fetch');

const CLIENT_ID = process.env.OSU_CLIENT_ID;
const CLIENT_SECRET = process.env.OSU_CLIENT_SECRET;
const REDIRECT_URI = process.env.OSU_REDIRECT_URI;

// 生成授权链接
function generateAuthUrl(state) {
    return `https://osu.ppy.sh/oauth/authorize?
    client_id=${CLIENT_ID}&
    redirect_uri=${encodeURIComponent(REDIRECT_URI)}&
    response_type=code&
    scope=public%20identify%20friends.read&
    state=${state}`;
}

// 使用 code 换取 access_token
async function exchangeCodeForToken(code) {
    const response = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code: code,
        }),
    });
    const data = await response.json();
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // 获取 refresh_token
        expires_in: data.expires_in, // 获取过期时间
    };
}

// 获取用户信息
async function getUserInfo(accessToken) {
    const response = await fetch('https://osu.ppy.sh/api/v2/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

async function refreshAccessToken(refreshToken) {
    const response = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });
    const data = await response.json();
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // 新的 refresh_token
        expires_in: data.expires_in,
    };
}

module.exports = {
    generateAuthUrl,
    exchangeCodeForToken,
    getUserInfo,
    refreshAccessToken,
};