import fs from 'fs';
import https from 'https';
import ExcelJs from 'exceljs';
import { Scenes } from 'telegraf';

const givehomeworkWizard = new Scenes.WizardScene(
    'GIVEHOMEWORK_WIZARD',

    (ctx) => {
        console.log('Started givehomework wizard: Requesting name');
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
                    const columnD = row.getCell(4).value; 
                    const columnG = row.getCell(7).value; 
                    const columnI = row.getCell(9).value; 
                    const columnL = row.getCell(12).value;
                    const columnN = row.getCell(14).value;
                    const columnQ = row.getCell(17).value; 

                    const monthpercent = Math.trunc((columnD / columnG)*100);
                    const weekpercent = Math.trunc((columnI / columnL)*100);
                    const daypercent = Math.trunc((columnN / columnQ)*100);
                    const responseMessage = `Найдены данные для ${ctx.scene.state.userName}:\n` +
                        `Процент выданного дз за месяц: ${monthpercent}%\n` +
                        `Процент выданного дз за неделю: ${weekpercent}%\n` +
                        `Процент выданного дз за день: ${daypercent}%`;

                      if   (weekpercent < 70) {
                        ctx.reply('Процент выданного дз за неделю ниже 70%!');
                    } if (monthpercent < 70) {
                        ctx.reply('Процент выданного дз за месяц ниже 70%!');
                    } if (daypercent < 70) {
                        ctx.reply('Процент выданного дз за день ниже 70%!');
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
    name: 'givehomework',
    scene: givehomeworkWizard,
    execute: async (ctx) => {
        try {
            return ctx.scene.enter('GIVEHOMEWORK_WIZARD');
        } catch (error) {
            console.error('Error entering scene:', error);
            ctx.reply('Произошла ошибка при запуске команды.');
        }
    }
};

export default command;