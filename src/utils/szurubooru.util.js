const config = require('../../config.json')
const fetch = require('node-fetch')

/**
 * Encodes an API token
 * @param {string} token The token to encode
 * @returns {string} The encoded token
 */
function encodeToken(token) {
    const base64Token = Buffer.from(token, 'utf-8').toString('base64')
    const tokenString = base64Token.toString('ascii')
    return tokenString
}

const adminToken = encodeToken(config.szurubooru.token)

/**
 * Performs an API request
 * @param {string} route API route
 * @param {string} data Request body
 * @param {string} [token] Token override
 * @returns {Object} The API response
 */
async function req(route, data, token = null) {
    if (!config.szurubooru.apiUrl) return {}

    let reqToken = token ? encodeToken(token) : adminToken

    const res = await fetch(`${config.szurubooru.apiUrl}${route}`, {
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${reqToken}`
        },
        'body': JSON.stringify(data),
        'method': 'POST'
    })
    const json = await res.json()
    return json
}

/* Export functions */
module.exports.req = req