import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { SampleBot } from "./bot.js";




config()

const bot = new SampleBot(process.env.TELEGRAM_TOKEN)
bot.start();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
