import fs from 'fs';
import https from 'https';
import ExcelJs from 'exceljs';

import { isAbsolute, join, parse, resolve } from 'path';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { findFiles } from './findFiles.js';

export const commandLoader = async(bot) => {
    
    for(const file of findFiles("./src/commands/")) {
        const commandName = file.split('\\commands\\')[1].slice(0, -3);
    
        try {
            const { dir, base } = parse(file);
            const {default: command} = await import(pathToFileURL(file));

            bot.command(command.name, async (ctx) => {
                ctx.telegramBot = bot;
                await command.execute(ctx);
            });
            bot.commands.set(command.name, command);
    
            console.log(`Команда "/${commandName}" успешно загружено!`);
        } catch(err) {
            console.error(`Команда /${commandName} не смогла запуститься. ${err.stack}`);
        }
    }
}