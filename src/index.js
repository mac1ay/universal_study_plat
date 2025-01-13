import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { SampleBot } from "./bot.js";



config()

const bot = new SampleBot(process.env.TELEGRAM_TOKEN)
bot.start();

// export const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {});

// bot.start((ctx) => ctx.reply('Привет, выбери нужную комманду из списка, чтобы вызвать меню комманд, напиши "меню"'));

// bot.on("message", async ctx => {
//     const chatId = ctx.chat.id;

//     if (ctx.message.text == "меню") {
//         showMenu(bot, chatId);
//     } else if (ctx.message.text == "мяу") {
//         let mes = await getMessage();
//         ctx.reply(mes); 
//     } else if (ctx.message.text == "% проверенных домашних заданий педагогами") {
//         getHomework();
//     } else {
//         closeMenu(bot, chatId);
//     }
// })
// bot.on('message', async (ctx) => {
//     if (ctx.message.text) {
//         ctx.reply('Пожалуйста, отправьте вашу фамилию имя в формате "Иванов Иван"');
//         return;
//     }

// bot.on('message', async (ctx) => {
//     if (!ctx.message.document) {
//         ctx.reply('Пожалуйста, отправьте xlsx файл');
//         return;
//     }

//     const fileName = ctx.message.document.file_name;
//     if (!fileName.endsWith('.xlsx')) {
//         ctx.reply('Пожалуйста, отправьте файл в формате xlsx');
//         return;
//     }

//     try {
//         const file = await ctx.telegram.getFile(ctx.message.document.file_id);
//         const filePath = file.file_path;
//         const downloadFileName = 'downloaded.xlsx';
        
//         const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
        
//         https.get(fileUrl, (response) => {
//             const fileStream = fs.createWriteStream(downloadFileName);
//             response.pipe(fileStream);
            
//             fileStream.on('finish', async () => {
//                 const workbook = new ExcelJs.Workbook();
//                 await workbook.xlsx.readFile(downloadFileName);
                
//                 const worksheet = workbook.getWorksheet(1);
                
//                 worksheet.eachRow((row, rowNumber) => {

//                     console.log(`Row ${rowNumber}:`, row.values);
//                 });
                
//                 fs.unlinkSync(downloadFileName);
                
//                 ctx.reply('Файл успешно прочитан!');
//             });
//         });
//     } catch (error) {
//         console.error('Ошибка:', error);
//         ctx.reply('Произошла ошибка при обработке файла.');
//     }
// });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// bot.launch(() => console.log('ебанула шарманка')).catch(console.log)
// const bot = new SampleBot(process.env.TELEGRAM_TOKEN);
// bot.start((ctx) => ctx.reply('Здарова, ты че как'));