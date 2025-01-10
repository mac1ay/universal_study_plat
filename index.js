import { Telegraf } from "telegraf";
import { showMenu, closeMenu } from "./menu.js";
import { getMessage } from "./mesagegg.js";
import { config } from "dotenv";

config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {});

bot.start((ctx) => ctx.reply('Здарова, ты че как'));

bot.on("message", async ctx => {
    const chatId = ctx.chat.id;

    if (ctx.message.text == "меню") {
        showMenu(bot, chatId);
    } else if (ctx.message.text == "мяу") {
        let mes = await getMessage();
        ctx.reply(mes); 
    } else if (ctx.message.text == "% проверенных домашних заданий педагогами") {
        getHomework
    } else {
        closeMenu(bot, chatId);
    }
})

bot.launch()