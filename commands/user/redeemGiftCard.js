module.exports = (bot, userId, database) => {
    bot.sendMessage(userId, 'Digite o código do Gift Card:');
    bot.once('message', (msg) => {
        const code = msg.text.trim();
        const giftCardIndex = database.giftCards.findIndex(gc => gc.code === code);
        if (giftCardIndex !== -1) {
            const value = database.giftCards[giftCardIndex].value;
            database.users[userId].balance += value;
            database.giftCards.splice(giftCardIndex, 1);
            bot.sendMessage(userId, `🎉 Gift Card resgatado! Valor: R$${value.toFixed(2)}`);
        } else {
            bot.sendMessage(userId, '❌ Código inválido ou já utilizado.');
        }
    });
};