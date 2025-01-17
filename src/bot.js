import { session, Telegraf, Scenes } from "telegraf"; 
import { commandLoader } from "./utils/CommandLoader.js";

export class SampleBot extends Telegraf {
    constructor(token) {
        super(token);
        this.commands = new Map();
        this.stage = new Scenes.Stage([]);
    }

    loadMiddlewares() {
        this.use(session());
        this.use(this.stage.middleware());
    }

    registerScene(scene) {
        this.stage.register(scene);
    }

    start() {
        this.loadMiddlewares();
        commandLoader(this);
        this.launch()
            .then(() => console.log('Бот запущен'))
            .catch(err => console.error('Ошибка при запуске...' + err));
        
        process.once('SIGINT', () => this.stop('SIGINT'));
        process.once('SIGTERM', () => this.stop('SIGTERM'));
    }
}
