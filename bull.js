import Bull from "bull";
import dotenv from "dotenv";
import cleanerProcessor from "./modules/cleaner/cleaner.processor.js";
import generatedWhitePageService from "./modules/generatedWhitePage/generatedWhitePage.service.js";
import whitePageProcessor from "./modules/white-page/whitePage.processor.js";

dotenv.config();

const redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    connectTimeout: 180000
};
  
const defaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: false,
};

const limiter = {
    max: 10000,
    duration: 1000,
    bounceBack: false,
};

const settings = {
    lockDuration: 600000, // Key expiration time for job locks.
    stalledInterval: 5000, // How often check for stalled jobs (use 0 for never checking).
    maxStalledCount: 2, // Max amount of times a stalled job will be re-processed.
    guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
    retryProcessDelay: 30000, // delay before processing next job in case of internal error.
    drainDelay: 5, // A timeout for when the queue is in drained state (empty waiting for jobs).
};

export const cleaningQueue = new Bull("cleaning_queue", { redis, defaultJobOptions, settings, limiter });
export const whitePageQueue = new Bull("white_page_queue", { redis, defaultJobOptions, settings, limiter });

//Cleaning
cleaningQueue.process("zip", cleanerProcessor.clean);
cleaningQueue.process("dir", cleanerProcessor.clean);
cleaningQueue.process("db", cleanerProcessor.cleanDatabase);

//White Page
whitePageQueue.process(whitePageProcessor.generate);

whitePageQueue.on("active", generatedWhitePageService.onActive);
whitePageQueue.on("completed", generatedWhitePageService.onCompleted);
whitePageQueue.on("error", generatedWhitePageService.onError);
whitePageQueue.on("failed", generatedWhitePageService.onError);
