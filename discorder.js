import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

export default async function postToDiscord(webhook, data) {
    try {

        var payload = {
            "embeds": [
                {
                    "title": data?.title,
                    "image": { "url": data?.imageUrl },
                    "description": data?.description
                }
            ]
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }



        const req = await fetch(webhook, options);
        const res = await req.text()
        console.log('Posted to Discord successfully:', res);
    } catch (error) {
        console.error('Error posting to Discord:', error.message);
    }
}

// Usage example
// postToDiscord({ title: 'test title', imageUrl: 'https://i.imgur.com/4M34hi2.png', description: 'test description' })
