import { isAbsolute, join, parse, resolve } from 'path';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { findFiles } from './findFiles.js';
  
export const eventLoader = async(bot) => {
    for(const file of findFiles("./src/events/")) {
        const eventName = file.split('\\events\\')[1].slice(0, -3);
    
        try {
            const { dir, base } = parse(file);
            const event = await import(pathToFileURL(file));

            bot.on(eventName, (ctx) => event.execute(ctx));
    
            console.log(`Событие "${eventName}" успешно загружена!`);
        } catch(err) {
            console.error(`Событие ${eventName} не смогла запуститься. ${err.message.split("\n")[0]}`);
        }
    }
}