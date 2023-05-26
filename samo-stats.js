import api from 'api';
import dotenv from 'dotenv';
import discorder from './discorder.js';
import schedule from 'node-schedule';

const cron = process.argv[2] || process.env.CRON_SAMO_STATS;
dotenv.config();

const LAMPORTS_PER_SOL = 1000000000;

const me = api('@tallal-test/v1.0#1dpgalhi1f8wj');

// minute | hour | day of month | month | day of week monday = 1
const tweetSchedule = schedule.scheduleJob(import.meta.url, cron, async function () {

    me.server('https://api-mainnet.magiceden.dev/v2');
    const req = await me.getCollectionsSymbolStats({ symbol: 'samo_nft' })
    console.log(req.data);

    //{
    //   symbol: 'lily',
    //   floorPrice: 8570000000,
    //   listedCount: 537,
    //   avgPrice24hr: 8178149308.839158,
    //   volumeAll: 875138574051391.5
    // }

    discorder(process.env.DISCORD_SAMO_WEBHOOK, { title: 'Samo Stats', description: `Current Floor Price: ${(req.data.floorPrice / LAMPORTS_PER_SOL).toFixed(2)} SOL 💃\nHow many listed: ${req.data.listedCount} 🙉\nAverage Price (24hr): ${(req.data.avgPrice24hr / LAMPORTS_PER_SOL).toFixed(2)} SOL 🥑\nVolume (24hr): ${(req.data.volumeAll / LAMPORTS_PER_SOL).toFixed(2)} SOL 🏛️` });

});

const nextJob = schedule.scheduledJobs[Object.keys(schedule.scheduledJobs)[0]];
const nextJobName = nextJob.name;
const nextJobTime = nextJob.nextInvocation().toString();

console.log('Next Job:', nextJobName);
console.log('Next Job Time:', nextJobTime);