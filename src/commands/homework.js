import fs from 'fs';
import https from 'https';
import ExcelJs from 'exceljs';
import { Scenes } from 'telegraf';

const homeworkWizard = new Scenes.WizardScene(
    'HOMEWORK_WIZARD',

    (ctx) => {
        console.log('Started homework wizard: Requesting name');
        ctx.reply('Введите имя фамилию в формате Иванов Иван');
        return ctx.wizard.next();
    },

    (ctx) => {
        console.log('Step 2: Saving name and requesting file');
        ctx.scene.state.userName = ctx.message.text;

        console.log(`Received name: ${ctx.scene.state.userName}`);
        ctx.reply('Отправьте xlsx файл');

        return ctx.wizard.next();
    },

    async (ctx) => {
        console.log('Step 3: Processing Excel file');
        
        if (!ctx.message?.document) {
            console.log('No document received');
            ctx.reply('Пожалуйста, отправьте файл Excel (.xlsx)');
            return;
        }

        const doc = ctx.message.document;
        console.log('Received document:', doc.file_name);

        if (!doc.file_name.toLowerCase().endsWith('.xlsx')) {
            console.log('Invalid file format');
            ctx.reply('Пожалуйста, отправьте файл в формате xlsx');
            return;
        }

        try {
            const file = await ctx.telegram.getFile(doc.file_id);
            const downloadFileName = `temp_${Date.now()}.xlsx`;
            console.log('Downloading file:', downloadFileName);

            await new Promise((resolve, reject) => {
                const fileStream = fs.createWriteStream(downloadFileName);
                https.get(
                    `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`,
                    (response) => {
                        response.pipe(fileStream);
                        fileStream.on('finish', () => {
                            fileStream.close();
                            resolve();
                        });
                        fileStream.on('error', (err) => {
                            fs.unlink(downloadFileName, () => {});
                            reject(err);
                        });
                    }
                ).on('error', (err) => {
                    reject(err);
                });
            });

            const workbook = new ExcelJs.Workbook();
            await workbook.xlsx.readFile(downloadFileName);
            
            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                throw new Error('Лист не найден в файле Excel');
            }

            let found = false;
            worksheet.eachRow((row, rowNumber) => {
                const rowValue = row.values[2] ? row.values[2].toString().trim() : '';
                console.log(`Checking row ${rowNumber}:`, rowValue);
                
                if (rowValue.toLowerCase() === ctx.scene.state.userName.toLowerCase()) {
                    found = true;
                    const columnE = row.getCell(5).value; 
                    const columnF = row.getCell(6).value; 
                    const columnJ = row.getCell(10).value; 
                    const columnK = row.getCell(11).value; 
                    const columnO = row.getCell(15).value;
                    const columnP = row.getCell(16).value;

                    const weekpercent = Math.trunc((columnF - columnE) / ((columnF + columnE) / 2) * 100)+100;
                    const monthpercent = Math.trunc((columnK - columnJ) / ((columnK + columnJ) / 2) * 100)+100;
                    const daypercent = Math.trunc((columnP - columnO) / ((columnP + columnO) / 2) * 100)+100;

                    const responseMessage = `Найдены данные для ${ctx.scene.state.userName}:\n` +
                        `Процент проверенного дз за неделю: ${weekpercent}%\n` +
                        `Процент проверенного дз за месяц: ${monthpercent}%\n` +
                        `Процент проверенного дз за день: ${daypercent}%`;

                    if (weekpercent < 75) {
                        ctx.reply('Процент проверенного дз за неделю ниже 75%!');
                    } else if (monthpercent < 75) {
                        ctx.reply('Процент проверенного дз за месяц ниже 75%!');
                    } else if(daypercent < 75) {
                        ctx.reply('Процент проверенного дз за день ниже 75%!');
                    };
        
                    console.log('Found data:', responseMessage);
                    ctx.reply(responseMessage);
                }
            });

            if (!found) {
                console.log('User not found');
                ctx.reply(`${ctx.scene.state.userName} не найден в файле`);
            }

            fs.unlinkSync(downloadFileName);
            console.log('Temporary file deleted');
            return ctx.scene.leave();

        } catch (error) {
            console.error('Error processing file:', error);
            ctx.reply('Произошла ошибка при обработке файла.');
            return ctx.scene.leave();
        }
    }
);

const command = {
    name: 'homework',
    scene: homeworkWizard,
    execute: async (ctx) => {
        try {
            return ctx.scene.enter('HOMEWORK_WIZARD');
        } catch (error) {
            console.error('Error entering scene:', error);
            ctx.reply('Произошла ошибка при запуске команды.');
        }
    }
};

export default command;