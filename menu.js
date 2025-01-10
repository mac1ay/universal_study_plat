import { keyboard } from "telegraf/markup"

export const showMenu = (bot, chatId) => {
    bot.telegram.sendMessage(chatId, "Выбирете действие", {
        reply_markup: {
            keyboard: [
                ["мяу"],
                ["% проверенных домашних заданий педагогами"],
                ["закрыть"]
            ]
        }
    })
}

export const closeMenu = (bot, chatId) => {
    bot.telegram.sendMessage(chatId, "закрываюсь...", {
        reply_markup: {
            remove_keyboard: true
        }
    })
}