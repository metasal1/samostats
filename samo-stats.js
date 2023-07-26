import api from 'api';
import dotenv from 'dotenv';
import discorder from './discorder.js';
import schedule from 'node-schedule';
import tweeter from './tweeter.js';
import samoPrice from './samoprice.js';

const cron = process.argv[2] || process.env.CRON_SAMO_STATS;
dotenv.config();

const LAMPORTS_PER_SOL = 1000000000;

const me = api('@tallal-test/v1.0#1dpgalhi1f8wj');

// minute | hour | day of month | month | day of week monday = 1
const tweetSchedule = schedule.scheduleJob(import.meta.url, cron, async function () {

    me.server('https://api-mainnet.magiceden.dev/v2');
    const req = await me.getCollectionsSymbolStats({ symbol: 'samo_nft' })
    console.log(req.data);

    const samo = await samoPrice();

    const floorPrice = (req.data.floorPrice / LAMPORTS_PER_SOL).toFixed(2);
    const listedCount = req.data.listedCount;
    discorder(process.env.DISCORD_SAMO_WEBHOOK, { title: 'Samo Stats', description: `Current Floor Price: ${floorPrice} SOL 💃\nHow many listed: ${listedCount} 🙉\nAverage Price (24hr): ${(req.data.avgPrice24hr / LAMPORTS_PER_SOL).toFixed(2)} SOL 🥑\nVolume (24hr): ${(req.data.volumeAll / LAMPORTS_PER_SOL).toFixed(2)} SOL 🏛️` });
    const tweet = `Floor:${floorPrice} SOL\nListed: ${listedCount}\nCoin: ${samo.toFixed(4)}\n`;
    tweeter(tweet)
});

const nextJob = schedule.scheduledJobs[Object.keys(schedule.scheduledJobs)[0]];
const nextJobName = nextJob.name;
const nextJobTime = nextJob.nextInvocation().toString();

console.log('Next Job:', nextJobName);
console.log('Next Job Time:', nextJobTime);