export default {
    name: 'menu',
    execute: async (ctx) => {
        await ctx.reply("Выбирете действие", {
            reply_markup: {
                keyboard: [
                    ["/closemenu", "/homework", "/givehomework"]
                ]
            }
        })
    }
}