export default {
    name: 'closemenu',
    execute: async (ctx) => {
        await ctx.reply('ok', {
            reply_markup: {
                remove_keyboard: true
            }
        })
    }
}