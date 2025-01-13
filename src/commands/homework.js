import fs from 'fs';
import https from 'https';
import ExcelJs from 'exceljs';

export default {
    name: 'homework',
    execute: async (ctx) => {
        ctx.telegramBot.on('document', async (ctx) => {
            const doc = ctx.message.document;
            
            // Проверка формата файла
            if (!doc.file_name.toLowerCase().endsWith('.xlsx')) {
                return ctx.reply('Пожалуйста, отправьте файл в формате xlsx');
            }

            try {
                // Получаем информацию о файле
                const file = await ctx.telegram.getFile(doc.file_id);
                const filePath = file.file_path;
                const downloadFileName = `download_${Date.now()}.xlsx`; // Уникальное имя файла

                // Создаем промис для загрузки файла
                await new Promise((resolve, reject) => {
                    https.get(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`, (response) => {
                        if (response.statusCode !== 200) {
                            reject(new Error(`Failed to download file: ${response.statusCode}`));
                            return;
                        }

                        const fileStream = fs.createWriteStream(downloadFileName);
                        response.pipe(fileStream);

                        fileStream.on('finish', () => {
                            fileStream.close();
                            resolve();
                        });

                        fileStream.on('error', (err) => {
                            fs.unlink(downloadFileName, () => {});
                            reject(err);
                        });
                    }).on('error', (err) => {
                        reject(err);
                    });
                });

                // Читаем файл Excel
                const workbook = new ExcelJs.Workbook();
                try {
                    await workbook.xlsx.readFile(downloadFileName);
                    
                    const worksheet = workbook.getWorksheet(1);
                    if (!worksheet) {
                        throw new Error('Лист не найден в файле Excel');
                    }

                    // Обработка данных
                    worksheet.eachRow((row, rowNumber) => {
                        console.log(`Row ${rowNumber}:`, row.values);
                    });

                    await ctx.reply('Файл успешно прочитан!');
                } catch (error) {
                    console.error('Ошибка при чтении Excel файла:', error);
                    await ctx.reply('Ошибка при чтении файла. Убедитесь, что файл является корректным Excel файлом.');
                } finally {
                    // Удаляем временный файл
                    try {
                        fs.unlinkSync(downloadFileName);
                    } catch (e) {
                        console.error('Ошибка при удалении временного файла:', e);
                    }
                }

            } catch (error) {
                console.error('Общая ошибка:', error);
                await ctx.reply('Произошла ошибка при обработке файла.');
            }
        });
        
        return ctx.reply('Пожалуйста, отправьте xlsx файл');
    }
}
