module.exports = (bot, userId, database) => {
    try {

        if (!database.users[userId]) {
            database.users[userId] = {
                lastBonus: null,
                balance: 0
            };

            bot.sendMessage(userId, '✅ Sua conta foi criada com sucesso! Seu saldo atual é R$0.00');
        } else {
            const balance = database.users[userId].balance.toFixed(2);
            bot.sendMessage(userId, `💰 Seu saldo atual: R$${balance}`);
        }
    } catch (error) {
        console.error('Erro ao verificar saldo:', error);
        bot.sendMessage(userId, '❌ Ocorreu um erro ao verificar seu saldo. Tente novamente mais tarde.');
    }
};
