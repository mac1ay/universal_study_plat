import { Telegraf } from "telegraf";
import { commandLoader } from "./utils/CommandLoader.js";

export class SampleBot extends Telegraf {
    constructor(token) {
        super(token);
        this.commands = new Map();
    }

    start() {
        commandLoader(this);
        // eventLoader(this)
        this.launch()
            .then(console.log('Бот запущен'))
            .catch(err => console.error('Ошибка при запуске...' + err));

        process.once('SIGINT', () => this.stop('SIGINT'))
        process.once('SIGTERM', () => this.stop('SIGTERM'))
    }
}
