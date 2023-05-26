import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import dotenv from 'dotenv';
import fetch from 'node-fetch';


dotenv.config();

const access_token = process.env.TWITTER_ACCESS_TOKEN;
const access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;

const endpointURL = `https://api.twitter.com/2/tweets`;

const oauth = OAuth({
    consumer: {
        key: consumer_key,
        secret: consumer_secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function getRequest(token, tweet) {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: endpointURL,
        method: 'POST'
    }, token));

    const req = await fetch(endpointURL, {
        method: 'POST',
        headers: {
            'Authorization': authHeader["Authorization"],
            'content-type': "application/json",
            'accept': "application/json"
        },
        body: JSON.stringify({ "text": tweet })
    });

    const res = await req.json();
    return res;
}

export default async function tweeter(tweet) {
    try {
        // Get user token and secret
        const userToken = {
            key: access_token,
            secret: access_token_secret
        };
        // Make the request
        const response = await getRequest(userToken, tweet);
        console.log(response);
    } catch (e) {
        console.dir(e);
    }
}
